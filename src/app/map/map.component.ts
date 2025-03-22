import {Component, OnInit} from '@angular/core';
import {NgForOf, NgOptimizedImage} from "@angular/common";

export type buttonObject = {
  index: number;
  label: string;
  area: string
}

export enum areas {
  PLAINS = "plains",
  FIELD = "field",
  FOREST = "forest",
  WATER = "water",
  MOUNTAIN = "mountain",
  CITY = "city"
}

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [
    NgOptimizedImage,
    NgForOf
  ],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})
export class MapComponent implements OnInit {
  buttons: any[] = new Array(100).fill(null);
  mapButtons: buttonObject[] = []

  ngOnInit() {
    this.populateMapButtonsWithLabels();
  }

  calculateTop(i: number): number {
    return 112 + Math.floor(i / 10) * 97.5;
  }

  calculateLeft(i: number): number {
    return 102 + (i % 10) * 97.5;
  }

  populateMapButtonsWithLabels() {
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

      const button: buttonObject = {
        index: i + 1,
        label: labelText,
        area: areaType
      }
      this.mapButtons.push(button);
    }
    console.log(this.mapButtons);
  }
}
