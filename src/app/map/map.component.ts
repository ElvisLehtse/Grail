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
    const plainIndexes: string[] = ["9A", "8B", "3C", "10C", "1D", "8D", "2E", "4E", "5E", "7E", "9E", "6F", "10F", "3G", "4G", "6G", "8G", "10G", "1H", "5H", "6H", "8H", "9H", "2I", "3I", "6I"];

    for (let i = 0; i < mapSize; i++) {
      const row: number = (i % 10) + 1;
      const column: string = letters[Math.floor(i / 10)];
      const labelText: string = `${row}${column}`;

      let areaType: string = "";
      if (plainIndexes.includes(labelText)) {
        areaType = areas.PLAINS;
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
