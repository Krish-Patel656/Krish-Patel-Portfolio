"use client"

import { useEffect, useRef } from "react"
import Phaser from "phaser"
import { WORLD_CREATURES, type WorldCreature } from "@/lib/worldData"

const WORLD_WIDTH = 1920
const WORLD_HEIGHT = 1280

type Direction = "up" | "down" | "left" | "right"
type MobileInput = Record<Direction, boolean>

type SceneApi = {
  finishEncounter: (id: string, caught: boolean) => void
  syncCaught: (ids: string[]) => void
}

export default function PixelWorldGame({
  caughtIds,
  onEncounter,
  onNearby,
  onLocation,
  onGalaxyExit,
}: {
  caughtIds: string[]
  onEncounter: (creature: WorldCreature) => void
  onNearby: (creature: WorldCreature | null) => void
  onLocation: (name: string) => void
  onGalaxyExit: () => void
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const gameRef = useRef<Phaser.Game | null>(null)
  const sceneApiRef = useRef<SceneApi | null>(null)
  const mobileInput = useRef<MobileInput>({ up: false, down: false, left: false, right: false })
  const callbacks = useRef({ onEncounter, onNearby, onLocation, onGalaxyExit })
  callbacks.current = { onEncounter, onNearby, onLocation, onGalaxyExit }

  useEffect(() => {
    if (!containerRef.current || gameRef.current) return
    const initiallyCaught = new Set(caughtIds)

    class ByteWorldScene extends Phaser.Scene {
      player!: Phaser.Physics.Arcade.Sprite
      cursors!: Phaser.Types.Input.Keyboard.CursorKeys
      keys!: Record<"W" | "A" | "S" | "D", Phaser.Input.Keyboard.Key>
      creatures = new Map<string, Phaser.Physics.Arcade.Sprite>()
      nearby: WorldCreature | null = null
      encounterOpen = false
      exiting = false
      location = ""

      constructor() {
        super("ByteWorld")
      }

      create() {
        this.createTextures()
        this.createTerrain()
        this.createLandmarks()
        this.physics.world.setBounds(64, 64, WORLD_WIDTH - 128, WORLD_HEIGHT - 128)
        this.createPlayer()
        this.createReturnRift()
        this.createCreatures(initiallyCaught)

        this.cameras.main.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT)
        this.cameras.main.startFollow(this.player, true, 0.09, 0.09)
        this.cameras.main.setZoom(1.35)
        this.cameras.main.fadeIn(900, 11, 18, 28)

        this.cursors = this.input.keyboard!.createCursorKeys()
        this.keys = this.input.keyboard!.addKeys("W,A,S,D") as typeof this.keys
        this.input.keyboard?.on("keydown-E", () => this.tryEncounter())
        this.input.keyboard?.on("keydown-SPACE", () => this.tryEncounter())

        sceneApiRef.current = {
          finishEncounter: (id, caught) => this.finishEncounter(id, caught),
          syncCaught: (ids) => this.syncCaught(ids),
        }
      }

      createTextures() {
        const graphics = this.make.graphics({ x: 0, y: 0 })

        graphics.fillStyle(0x132d22)
        graphics.fillRect(0, 0, 32, 32)
        graphics.fillStyle(0x173827)
        graphics.fillRect(0, 0, 16, 16)
        graphics.fillRect(16, 16, 16, 16)
        graphics.fillStyle(0x245438, 0.7)
        graphics.fillRect(6, 5, 2, 5)
        graphics.fillRect(23, 20, 2, 6)
        graphics.generateTexture("grass", 32, 32)

        graphics.clear()
        graphics.fillStyle(0x315f9a)
        graphics.fillRect(0, 0, 32, 32)
        graphics.lineStyle(2, 0x60a5c7, 0.5)
        graphics.lineBetween(0, 8, 32, 8)
        graphics.lineBetween(0, 24, 32, 24)
        graphics.generateTexture("water", 32, 32)

        graphics.clear()
        graphics.fillStyle(0x784a2b)
        graphics.fillRect(12, 20, 8, 12)
        graphics.fillStyle(0x174e32)
        graphics.fillCircle(16, 13, 13)
        graphics.fillStyle(0x26734a)
        graphics.fillCircle(10, 9, 7)
        graphics.fillCircle(22, 10, 8)
        graphics.generateTexture("tree", 32, 32)

        graphics.clear()
        graphics.fillStyle(0x0f172a)
        graphics.fillEllipse(12, 27, 18, 5)
        graphics.fillStyle(0x2563eb)
        graphics.fillRoundedRect(5, 8, 14, 16, 4)
        graphics.fillStyle(0x0ea5e9)
        graphics.fillRect(7, 4, 10, 8)
        graphics.fillStyle(0xf1f5f9)
        graphics.fillRect(8, 6, 2, 2)
        graphics.fillRect(14, 6, 2, 2)
        graphics.fillStyle(0x172554)
        graphics.fillRect(6, 23, 5, 6)
        graphics.fillRect(13, 23, 5, 6)
        graphics.generateTexture("player", 24, 30)

        WORLD_CREATURES.forEach((creature, index) => {
          graphics.clear()
          graphics.fillStyle(0x020617, 0.35)
          graphics.fillEllipse(18, 32, 26, 7)
          graphics.fillStyle(creature.accent)
          if (index % 3 === 0) {
            graphics.fillTriangle(7, 13, 11, 2, 16, 14)
            graphics.fillTriangle(21, 14, 26, 2, 29, 15)
          } else if (index % 3 === 1) {
            graphics.fillCircle(9, 11, 6)
            graphics.fillCircle(27, 11, 6)
          } else {
            graphics.fillTriangle(5, 17, 13, 8, 14, 21)
            graphics.fillTriangle(31, 17, 23, 8, 22, 21)
          }
          graphics.fillStyle(creature.color)
          graphics.fillRoundedRect(7, 9, 22, 22, index % 2 ? 10 : 6)
          graphics.fillStyle(0xffffff)
          graphics.fillRect(12, 15, 5, 5)
          graphics.fillRect(21, 15, 5, 5)
          graphics.fillStyle(0x111827)
          graphics.fillRect(14, 17, 2, 2)
          graphics.fillRect(23, 17, 2, 2)
          graphics.fillStyle(creature.accent)
          graphics.fillRect(15, 25, 7, 2)
          graphics.generateTexture(`creature-${creature.id}`, 36, 36)
        })

        graphics.destroy()
      }

      createTerrain() {
        for (let y = 0; y < WORLD_HEIGHT; y += 32) {
          for (let x = 0; x < WORLD_WIDTH; x += 32) {
            const water = x < 64 || y < 64 || x >= WORLD_WIDTH - 64 || y >= WORLD_HEIGHT - 64
            this.add.image(x, y, water ? "water" : "grass").setOrigin(0).setDepth(-20)
          }
        }

        const roads = this.add.graphics().setDepth(-15)
        roads.fillStyle(0xc6a66b)
        roads.fillRoundedRect(96, 602, 1728, 92, 18)
        roads.fillRoundedRect(914, 96, 92, 1088, 18)
        roads.fillStyle(0xe1c98f, 0.38)
        for (let x = 110; x < 1810; x += 64) roads.fillRect(x, 642, 34, 8)
        for (let y = 110; y < 1170; y += 64) roads.fillRect(956, y, 8, 34)

        const pond = this.add.graphics().setDepth(-14)
        pond.fillStyle(0x245a91)
        pond.fillRoundedRect(1050, 740, 360, 260, 80)
        pond.lineStyle(5, 0x60a5c7, 0.55)
        pond.strokeRoundedRect(1050, 740, 360, 260, 80)

        const flowers = this.add.graphics().setDepth(-12)
        for (let i = 0; i < 95; i++) {
          const x = 100 + ((i * 173) % 1700)
          const y = 100 + ((i * 97) % 1050)
          if (Math.abs(y - 648) < 70 || Math.abs(x - 960) < 70) continue
          flowers.fillStyle([0xf9a8d4, 0xfde68a, 0x93c5fd][i % 3])
          flowers.fillRect(x, y, 3, 3)
        }

        const obstacles = this.physics.add.staticGroup()
        const treePositions: [number, number][] = []
        for (let i = 0; i < 48; i++) {
          const x = 110 + ((i * 241) % 1690)
          const y = 100 + ((i * 157) % 1070)
          if (Math.abs(y - 648) < 90 || Math.abs(x - 960) < 90) continue
          if (x > 1020 && x < 1440 && y > 710 && y < 1030) continue
          treePositions.push([x, y])
        }
        treePositions.forEach(([x, y]) => {
          const tree = obstacles.create(x, y, "tree") as Phaser.Physics.Arcade.Sprite
          tree.setDepth(y)
          tree.body.setSize(18, 12).setOffset(7, 19)
        })
        this.registry.set("obstacles", obstacles)
      }

      createLandmarks() {
        const createBuilding = (
          x: number,
          y: number,
          width: number,
          height: number,
          color: number,
          title: string,
          subtitle: string
        ) => {
          const building = this.add.graphics().setDepth(y)
          building.fillStyle(0x050816, 0.35)
          building.fillRoundedRect(x + 8, y + 12, width, height, 12)
          building.fillStyle(color)
          building.fillRoundedRect(x, y, width, height, 12)
          building.fillStyle(0x0f172a)
          building.fillRect(x + 12, y + 18, width - 24, height - 32)
          building.fillStyle(0xf8fafc)
          building.fillRect(x + width / 2 - 15, y + height - 34, 30, 34)
          this.add
            .text(x + width / 2, y - 12, title, {
              fontFamily: "monospace",
              fontSize: "16px",
              color: "#ffffff",
              backgroundColor: "#050816",
              padding: { x: 8, y: 4 },
            })
            .setOrigin(0.5)
            .setDepth(y + height + 1)
          this.add
            .text(x + width / 2, y + height + 14, subtitle, {
              fontFamily: "monospace",
              fontSize: "10px",
              color: "#cbd5e1",
            })
            .setOrigin(0.5)
            .setDepth(y + height + 1)
        }

        createBuilding(180, 125, 360, 110, 0x14532d, "PROJECT PRESERVE", "SafeWay · BioSight · MapScrib.ai")
        createBuilding(1330, 120, 390, 110, 0x4c1d95, "EXPERIENCE LEAGUE", "EchoStar · Eyes Now · Nebula Labs")
        createBuilding(1420, 1040, 300, 105, 0x1e3a8a, "SKILL LAB", "Languages · Frameworks · Infrastructure")

        this.add
          .text(960, 560, "BYTEWORLD\nPORTFOLIO REGION", {
            align: "center",
            fontFamily: "monospace",
            fontStyle: "bold",
            fontSize: "20px",
            color: "#ecfeff",
            backgroundColor: "#082f49",
            padding: { x: 18, y: 10 },
          })
          .setOrigin(0.5)
          .setDepth(900)
      }

      createPlayer() {
        this.player = this.physics.add.sprite(960, 720, "player")
        this.player.setCollideWorldBounds(true).setDepth(721)
        this.player.body.setSize(16, 18).setOffset(4, 11)
        const obstacles = this.registry.get("obstacles") as Phaser.Physics.Arcade.StaticGroup
        this.physics.add.collider(this.player, obstacles)
      }

      createReturnRift() {
        const x = 1120
        const y = 1110
        const rift = this.add.container(x, y).setDepth(y - 2)
        const shadow = this.add.graphics()
        shadow.fillStyle(0x020208)
        shadow.fillEllipse(0, 0, 104, 62)
        shadow.lineStyle(8, 0x581c87, 0.9)
        shadow.strokeEllipse(0, 0, 104, 62)
        shadow.lineStyle(4, 0xc084fc, 0.85)
        shadow.strokeEllipse(0, 0, 72, 42)
        shadow.fillStyle(0xffffff, 0.9)
        for (let i = 0; i < 8; i++) {
          const angle = (i / 8) * Math.PI * 2
          shadow.fillRect(Math.cos(angle) * 44 - 1, Math.sin(angle) * 25 - 1, 3, 3)
        }
        rift.add(shadow)
        this.tweens.add({
          targets: rift,
          scaleX: 1.08,
          scaleY: 0.92,
          duration: 900,
          yoyo: true,
          repeat: -1,
          ease: "Sine.InOut",
        })
        this.add
          .text(x, y + 48, "RETURN RIFT · GALAXY", {
            fontFamily: "monospace",
            fontSize: "10px",
            color: "#e9d5ff",
            backgroundColor: "#1e0b2ddd",
            padding: { x: 6, y: 3 },
          })
          .setOrigin(0.5)
          .setDepth(y + 2)

        const zone = this.add.zone(x, y, 74, 42)
        this.physics.add.existing(zone, true)
        this.physics.add.overlap(this.player, zone, () => {
          if (this.exiting || this.encounterOpen) return
          this.exiting = true
          this.player.setVelocity(0)
          this.player.disableBody()
          this.cameras.main.shake(450, 0.018)
          this.cameras.main.fadeOut(850, 10, 2, 20)
          this.tweens.add({
            targets: this.player,
            x,
            y,
            scale: 0.05,
            angle: 720,
            duration: 750,
            ease: "Quad.In",
          })
          window.setTimeout(() => callbacks.current.onGalaxyExit(), 700)
        })
      }

      createCreatures(caught: Set<string>) {
        WORLD_CREATURES.forEach((creature, index) => {
          const sprite = this.physics.add.sprite(creature.x, creature.y, `creature-${creature.id}`)
          sprite.setImmovable(true).setDepth(creature.y)
          sprite.setData("creature", creature)
          sprite.setData("baseY", creature.y)
          if (caught.has(creature.id)) sprite.setAlpha(0.48)
          this.tweens.add({
            targets: sprite,
            y: creature.y - 5,
            duration: 850 + index * 55,
            yoyo: true,
            repeat: -1,
            ease: "Sine.InOut",
          })
          this.creatures.set(creature.id, sprite)
          this.add
            .text(creature.x, creature.y + 27, creature.name, {
              fontFamily: "monospace",
              fontSize: "10px",
              color: caught.has(creature.id) ? "#94a3b8" : "#ffffff",
              backgroundColor: "#07110ddd",
              padding: { x: 5, y: 2 },
            })
            .setOrigin(0.5)
            .setDepth(creature.y + 2)
        })
      }

      tryEncounter() {
        if (!this.nearby || this.encounterOpen) return
        this.encounterOpen = true
        this.player.setVelocity(0)
        callbacks.current.onEncounter(this.nearby)
      }

      finishEncounter(id: string, caught: boolean) {
        const sprite = this.creatures.get(id)
        if (sprite && caught) {
          this.tweens.add({
            targets: sprite,
            scale: 0.15,
            angle: 360,
            duration: 420,
            yoyo: true,
            onComplete: () => sprite.setAlpha(0.48).setAngle(0),
          })
          this.cameras.main.flash(180, 255, 255, 255, false)
        }
        this.encounterOpen = false
      }

      syncCaught(ids: string[]) {
        const caught = new Set(ids)
        this.creatures.forEach((sprite, id) => {
          sprite.setAlpha(caught.has(id) ? 0.48 : 1)
        })
      }

      update() {
        if (!this.player) return
        const input = mobileInput.current
        const left = this.cursors.left.isDown || this.keys.A.isDown || input.left
        const right = this.cursors.right.isDown || this.keys.D.isDown || input.right
        const up = this.cursors.up.isDown || this.keys.W.isDown || input.up
        const down = this.cursors.down.isDown || this.keys.S.isDown || input.down

        let x = Number(right) - Number(left)
        let y = Number(down) - Number(up)
        if (this.encounterOpen || this.exiting) {
          x = 0
          y = 0
        }
        const length = Math.hypot(x, y) || 1
        this.player.setVelocity((x / length) * 185, (y / length) * 185)
        if (x !== 0) this.player.setFlipX(x < 0)
        this.player.setAngle(x || y ? Math.sin(this.time.now * 0.018) * 2 : 0)
        this.player.setDepth(this.player.y)

        let closest: WorldCreature | null = null
        let closestDistance = 70
        WORLD_CREATURES.forEach((creature) => {
          const sprite = this.creatures.get(creature.id)
          if (!sprite) return
          sprite.setDepth(sprite.y)
          const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, sprite.x, sprite.y)
          if (distance < closestDistance) {
            closestDistance = distance
            closest = creature
          }
        })
        if (closest?.id !== this.nearby?.id) {
          this.nearby = closest
          callbacks.current.onNearby(closest)
        }

        const nextLocation =
          this.player.x < 800 && this.player.y < 580
            ? "Project Preserve"
            : this.player.x > 1180 && this.player.y < 620
              ? "Experience League"
              : this.player.x > 1250 && this.player.y > 760
                ? "Skill Grove"
                : this.player.y > 760
                  ? "Origin Fields"
                  : "Central Crossing"
        if (nextLocation !== this.location) {
          this.location = nextLocation
          callbacks.current.onLocation(nextLocation)
        }
      }
    }

    const game = new Phaser.Game({
      type: Phaser.AUTO,
      parent: containerRef.current,
      width: 960,
      height: 600,
      backgroundColor: "#0b1712",
      pixelArt: true,
      roundPixels: true,
      physics: {
        default: "arcade",
        arcade: { debug: false },
      },
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
      scene: ByteWorldScene,
    })
    gameRef.current = game

    const onMove = (event: Event) => {
      const detail = (event as CustomEvent<{ direction: Direction; active: boolean }>).detail
      mobileInput.current[detail.direction] = detail.active
    }
    const onFinish = (event: Event) => {
      const detail = (event as CustomEvent<{ id: string; caught: boolean }>).detail
      sceneApiRef.current?.finishEncounter(detail.id, detail.caught)
    }
    const onInteract = () => {
      const scene = game.scene.getScene("ByteWorld") as ByteWorldScene
      scene?.tryEncounter()
    }
    window.addEventListener("byteworld:move", onMove)
    window.addEventListener("byteworld:finish", onFinish)
    window.addEventListener("byteworld:interact", onInteract)

    return () => {
      window.removeEventListener("byteworld:move", onMove)
      window.removeEventListener("byteworld:finish", onFinish)
      window.removeEventListener("byteworld:interact", onInteract)
      sceneApiRef.current = null
      game.destroy(true)
      gameRef.current = null
    }
  }, [])

  useEffect(() => {
    sceneApiRef.current?.syncCaught(caughtIds)
  }, [caughtIds])

  return <div ref={containerRef} className="h-full w-full [&_canvas]:!block" />
}
