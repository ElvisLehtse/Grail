import {Component, OnInit} from '@angular/core';
import {NgClass, NgForOf, NgIf, NgOptimizedImage, SlicePipe} from "@angular/common";
import {ClueService} from "../services/clue.service";

export type gridObject = {
  label: string;
  area: string;
  open: boolean;
  grail: boolean;
}

export enum areas {
  PLAINS = "Plains",
  FIELD = "Field",
  FOREST = "Forest",
  WATER = "Water",
  MOUNTAIN = "Mountain",
  CITY = "City"
}

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [
    NgOptimizedImage,
    NgForOf,
    NgClass,
    NgIf,
    SlicePipe
  ],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})
export class MapComponent implements OnInit {
  mapGrids: gridObject[] = [];
  roundButtons: string[] = ["End of First Round", "End of Second Round", "End of Third Round", "End of Fourth Round"];
  numberOfRoundsEnded: number = 0;
  ultimateArtifact: HTMLAudioElement = new Audio();
  digSound: HTMLAudioElement = new Audio();
  clueGrids: gridObject[] = [];
  areas = areas;
  isSettingsOpen: boolean = false;
  public isPlayerCountTwo: boolean = true;
  public digSoundOn: boolean = true;

  constructor(
    private clueService: ClueService
  ) {}

  ngOnInit() {
    this.populateMapGridsWithData();
    this.loadAudio();
    this.clueService.findPossibleGridClues(this.mapGrids);
  }

  calculateTop(i: number): number {
    return 112 + Math.floor(i / 10) * 97.5;
  }

  calculateLeft(i: number): number {
    return 102 + (i % 10) * 97.5;
  }

  populateMapGridsWithData() {
    const mapSize = 100;
    const letters: string[] = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
    const plainReferences: string[] = ["A9", "B8", "C3", "C10", "D1", "D8", "E2", "E4", "E5", "E7", "E9", "F6", "F10", "G3", "G4", "G6", "G8", "G10", "H1", "H5", "H6", "H8", "H9", "I2", "I3", "I6"];
    const fieldReferences: string[] = ["C7", "D4", "D7", "E3", "E8", "F7", "G7", "H2", "H4", "J6"];
    const forestReferences: string[] = ["A1", "A2", "A3", "A8", "D10", "E1", "F1", "F4", "F5", "F9", "G1", "H10", "I10", "J1", "J2"];
    const waterReferences: string[] = ["A5", "A6", "A7", "A10", "B4", "B5", "B10", "C4", "C5", "I4", "I5", "J4", "J5", "J9", "J10"];
    const mountainReferences: string[] = ["B1", "B2", "B6", "C2", "C6", "C8", "C9", "D2", "D5", "D6", "F2", "F3", "I7", "I8", "J7", "J8"];
    const cityReferences: string[] = ["A4", "B3", "B7", "B9", "C1", "D3", "D9", "E6", "E10", "F8", "G2", "G5", "G9", "H3", "H7", "I1", "I9", "J3"];

    for (let i = 0; i < mapSize; i++) {
      const row: number = (i % 10) + 1;
      const column: string = letters[Math.floor(i / 10)];
      const labelText: string = `${column}${row}`;

      let areaType: string = "";
      if (plainReferences.includes(labelText)) {
        areaType = areas.PLAINS;
      } else if (fieldReferences.includes(labelText)) {
        areaType = areas.FIELD;
      } else if (forestReferences.includes(labelText)) {
        areaType = areas.FOREST;
      } else if (waterReferences.includes(labelText)) {
        areaType = areas.WATER;
      } else if (mountainReferences.includes(labelText)) {
        areaType = areas.MOUNTAIN;
      } else if (cityReferences.includes(labelText)) {
        areaType = areas.CITY;
      }

      const button: gridObject = {
        label: labelText,
        area: areaType,
        open: true,
        grail: false,
      }
      this.mapGrids.push(button);
    }
    this.markGrailLocation();
    console.log(this.mapGrids);
  }

  markGrailLocation() {
    const randomIndex = Math.floor(Math.random() * 100);
    let grid: gridObject | undefined = this.mapGrids.at(randomIndex);
    if (grid) {
      grid.grail = true;
      this.clueService.grailGrid = grid;
    }
  }

  markGrid(index: number) {
    let grid: gridObject | undefined = this.mapGrids.at(index);
    if (grid) {
      grid.open = false;
      if (grid.grail) {
        this.digSound.play();
        setTimeout(() => {
          this.ultimateArtifact.play();
        }, 200);
      } else if (this.digSoundOn) {
        this.digSound.play();
      }
    }
  }

  loadAudio() {
    this.ultimateArtifact.src = "../../../assets/sounds/UltimateArtifact.wav";
    this.ultimateArtifact.load();
    this.digSound.src = "../../../assets/sounds/DigSound.wav";
    this.digSound.load();
  }

  changeRound(index: number) {
    this.numberOfRoundsEnded = index + 1;
    this.mapGrids = this.clueService.markGridsAfterEndOfRound(this.mapGrids, this.isPlayerCountTwo);
    this.clueGrids.push(this.clueService.getClue(this.numberOfRoundsEnded));
  }

  openSettings() {
    this.isSettingsOpen = !this.isSettingsOpen;
  }

  setPlayerCount() {
    this.isPlayerCountTwo = !this.isPlayerCountTwo;
  }

  setDigAudio() {
    this.digSoundOn = !this.digSoundOn;
  }
}
