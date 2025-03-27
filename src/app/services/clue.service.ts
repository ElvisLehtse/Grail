import {Injectable} from '@angular/core';
import {gridObject} from "../map/map.component";

@Injectable({
  providedIn: 'root'
})
export class ClueService {

  grailGrid: gridObject | undefined = undefined;
  possibleOneOrTwoStepGridClues: gridObject[] = [];
  possibleTwoOrThreeStepGridClues: gridObject[] = [];

  markGridsAfterEndOfRound(mapGrids: gridObject[], playerCount: number): gridObject[] {
    if (this.grailGrid) {
      const validOptions: gridObject[] = this.findValidOptions(mapGrids, this.grailGrid);
      if (validOptions.length === 0) return mapGrids; // If no remaining grids are available

      // Shuffle the valid options to ensure randomness
      this.shuffleArray(validOptions);

      let numberOfGridsToBeRevealed: number;
      if (playerCount === 2) {
        numberOfGridsToBeRevealed = Math.round(Math.random() * 5 + 10); // Generate a random number between 10 - 15 for two players
      } else {
        numberOfGridsToBeRevealed = Math.round(Math.random() * 5 + 7); // Generate a random number between 7 - 12 for three players
      }

      let markedCount = 0;
      let index = 0; // Keep track of the current position in the array

      while (markedCount < numberOfGridsToBeRevealed) {
        if (index >= validOptions.length) {
          index = 0; // Restart from the beginning if we reach the end
        }

        const grid = validOptions[index];
        const distance = this.calculateManhattanDistance(this.grailGrid.label, grid.label);
        const probability = this.getRevealProbability(distance);

        if (Math.random() < probability) {
          grid.open = false;
          markedCount++;
        }
        index++; // Move to the next grid
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
    if (distance >= 9) return 0.8;  // 80% chance for far grids
    if (distance >= 6) return 0.5;  // 50% for medium distance
    if (distance >= 3) return 0.3;  // 30% for close distance
    return 0.2;                     // 20% for very close distance
  }

  shuffleArray(array: gridObject[]): void {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  // This function sets up all the possible clue locations depending on the Grail location
  findPossibleGridClues(mapGrids: gridObject[]) {
    if (!this.grailGrid) return;
    for (let i = 0; i < mapGrids.length; i++) {
      const distance: number = this.calculateManhattanDistance(this.grailGrid.label, mapGrids[i].label);
      if (distance <= 2 && !mapGrids[i].grail) {
        this.possibleOneOrTwoStepGridClues.push(mapGrids[i]);
      }
      if (distance <= 3 && distance > 1) {
        this.possibleTwoOrThreeStepGridClues.push(mapGrids[i]);
      }
    }
  }

  // Provides one random grid from the possible clue lists. The grid is then removed from the list to avoid
  // duplicates. If the grid exists in both lists, it is removed from both as well
  getClue(endOfRound: number) {
    if (endOfRound <= 2) {
      const randomIndex = Math.floor(Math.random() * this.possibleTwoOrThreeStepGridClues.length);
      const randomGrid = this.possibleTwoOrThreeStepGridClues[randomIndex];
      this.possibleTwoOrThreeStepGridClues.splice(randomIndex, 1);
      if (this.possibleOneOrTwoStepGridClues.includes(randomGrid)) {
        const index = this.possibleOneOrTwoStepGridClues.indexOf(randomGrid);
        this.possibleOneOrTwoStepGridClues.splice(index, 1);
      }
      return randomGrid;

    } else {
      const randomIndex = Math.floor(Math.random() * this.possibleOneOrTwoStepGridClues.length);
      const randomGrid = this.possibleOneOrTwoStepGridClues[randomIndex];
      this.possibleOneOrTwoStepGridClues.splice(randomIndex, 1);
      return randomGrid;
    }
  }
}
