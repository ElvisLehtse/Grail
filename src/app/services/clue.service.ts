import {Injectable} from '@angular/core';
import {gridObject} from "../map/map.component";

@Injectable({
  providedIn: 'root'
})
export class ClueService {

  constructor() { }

  markGridsAfterEndOfRound(mapGrids: gridObject[]): gridObject[] {
    // Acquire grailGrid
    const grailGrid: gridObject | undefined = mapGrids.find(grid => grid.grail);
    if (grailGrid) {

      const validOptions = this.findValidOptions(mapGrids, grailGrid);

      // Shuffle the valid options to ensure randomness
      this.shuffleArray(validOptions);

      let numberOfGridsToBeRevealed = Math.round(Math.random() * 5 + 10); //Generate a random number between 10 - 15
      let markedCount = 0;

      for (const grid of validOptions) {
        if (markedCount >= numberOfGridsToBeRevealed) break;

        const distance = this.calculateManhattanDistance(grailGrid.label, grid.label);
        const probability = this.getRevealProbability(distance);

        if (Math.random() < probability) {
          grid.open = false;
          markedCount++;
        }
      }

    }
    return mapGrids;
  }

  findValidOptions(mapGrids: gridObject[], grailGrid: gridObject): gridObject[] {
    return mapGrids.filter(grid => grid.label !== grailGrid.label && grid.open);
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

  getRevealProbability(distance: number): number {
    if (distance >= 10) return 0.8;  // 80% chance for far grids
    if (distance >= 6) return 0.5;   // 50% for medium distance
    return 0.2;                      // 20% for close distance
  }

  shuffleArray(array: gridObject[]): void {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

}
