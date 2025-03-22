import {Injectable} from '@angular/core';
import {gridObject} from "../map/map.component";

@Injectable({
  providedIn: 'root'
})
export class ClueService {

  minimumAvailableGridsToRevealMore: number = 5;

  constructor() { }

  markGridsAfterEndOfRound(mapGrids: gridObject[], activeRound: number): gridObject[] {
    let minDistance: number;
    switch (activeRound) {
      case (1):
        minDistance = 4;
        break;
      case (2):
        minDistance = 3;
        break;
      case (3):
        minDistance = 2;
        break;
      case (4):
        minDistance = 1;
        break;
      default:
        minDistance = 0;
    }

    // Acquire grailGrid
    const grailGrid: gridObject | undefined = mapGrids.find(grid => grid.grail);
    if (grailGrid) {
      const validOptions: gridObject[] = this.findValidOptions(mapGrids, grailGrid, minDistance);
      mapGrids = this.markGrids(mapGrids, validOptions);
    }
    return mapGrids;
  }

  // Function to find valid grids that are at least `minDistance` away from the Grail grid
  findValidOptions(mapGrids: gridObject[], grailGrid: gridObject, minDistance: number): gridObject[] {
    const validOptions: gridObject[] = [];

    // Loop through the grid and check the distance of each element
    for (let i = 0; i < mapGrids.length; i++) {
      const grid = mapGrids[i];

      // Skip if it's the same as the grail grid, or it is already discovered
      if (grid.label === grailGrid.label || !grid.open) {
        continue;
      }

      const distance: number = this.calculateManhattanDistance(grailGrid.label, grid.label);

      // If distance is greater than or equal to minDistance, add it to the valid options
      if (distance >= minDistance) {
        validOptions.push(grid);
      }
    }
    return validOptions;
  }

  // Function to calculate Manhattan distance between two labels
  calculateManhattanDistance(label1: string, label2: string): number {
    const { row: row1, col: col1 } = this.parseLabel(label1);
    const { row: row2, col: col2 } = this.parseLabel(label2);
    return Math.abs(row1 - row2) + Math.abs(col1.charCodeAt(0) - col2.charCodeAt(0));
  }

  // Function to convert a label (e.g., "A5") to grid row and column indices
  parseLabel(label: string): { row: number; col: string } {
    const col = label.charAt(0);
    const row = parseInt(label.substring(1)) - 1; // 1-based to 0-based row
    return { row, col };
  }

  markGrids(mapGrids: gridObject[], validOptions: gridObject[]): gridObject[] {
    let numberOfGridsToBeRevealed: number = Math.round(Math.random() * 5 + 10); //Generate a random number between 10 - 15

    if (validOptions.length < numberOfGridsToBeRevealed + this.minimumAvailableGridsToRevealMore) {
      numberOfGridsToBeRevealed = validOptions.length - this.minimumAvailableGridsToRevealMore;
    }
    if (numberOfGridsToBeRevealed > 0) {
      const selectedIndexes = new Set<number>(); // Ensures unique selections

      while (selectedIndexes.size < numberOfGridsToBeRevealed) {
        const randomIndex = Math.floor(Math.random() * validOptions.length);
        if (!selectedIndexes.has(randomIndex)) {
          selectedIndexes.add(randomIndex);
          validOptions[randomIndex].open = false;
        }
      }
    }

    return mapGrids.map((grid) =>
      validOptions.find(option => option.label === grid.label) || grid);
  }

}
