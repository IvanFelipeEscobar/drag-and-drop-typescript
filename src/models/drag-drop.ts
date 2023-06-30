
    export interface Draggable {
        dragStartHander(e: DragEvent): void;
        dragEndHandler(e: DragEvent): void;
      }
      
      export interface DragTarget {
        dragOverHandler(e: DragEvent): void;
        dropHandler(e: DragEvent): void;
        dragLeaveHandler(e: DragEvent): void;
      }

