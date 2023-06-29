/// <reference path="./base-components.ts"/>
/// <reference path="../decorators/binder.ts"/>
/// <reference path= "../models/drag-drop.ts"/>
/// <reference path="../models/project.ts"/>

namespace App {

 export  class ProjectItems
 extends ModularComponent<HTMLUListElement, HTMLLIElement>
 implements Draggable
{
 private project: Project;
 get persons() {
   return this.project.people === 1
     ? `1 person`
     : `${this.project.people} persons`;
 }
 constructor(hostId: string, project: Project) {
   super(`single-post`, hostId, false, project.id);
   this.project = project;
   this.configure();
   this.renderLayout();
 }
 @binder
 dragStartHander(e: DragEvent) {
   e.dataTransfer!.setData(`text/plain`, this.project.id);
   e.dataTransfer!.effectAllowed = `move`;
 }
 dragEndHandler(_: DragEvent) {}
 configure() {
   this.element.addEventListener(`dragstart`, this.dragStartHander);
 }
 renderLayout() {
   this.element.querySelector("h2")!.textContent = this.project.title;
   this.element.querySelector("h3")!.textContent =
     this.persons + ` assigned`;
   this.element.querySelector("p")!.textContent = this.project.description;
 }
}
}