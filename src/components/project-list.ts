namespace App {

  export class ProjectList
  extends ModularComponent<HTMLDivElement, HTMLElement>
  implements DragTarget
{
  assignedProjects: Project[];

  constructor(private type: `active` | `finished`) {
    super(`project-list`, `app`, false, `${type}-projects`);

    this.assignedProjects = [];

    this.configure();
    this.renderLayout();
  }

  @binder
  dragOverHandler(e: DragEvent) {
    if (e.dataTransfer && e.dataTransfer.types[0] === `text/plain`) {
      e.preventDefault();
      const list = this.element.querySelector(`ul`)!;
      list.classList.add(`droppable`);
    }
  }

  @binder
  dropHandler(e: DragEvent) {
    const prjId = e.dataTransfer!.getData(`text/plain`);
    projectState.moveProject(
      prjId,
      this.type === `active` ? ProjectStatus.Active : ProjectStatus.Finished
    );
  }

  @binder
  dragLeaveHandler(_: DragEvent) {
    const list = this.element.querySelector(`ul`)!;
    list.classList.remove(`droppable`);
  }
  configure() {
    this.element.addEventListener("dragover", this.dragOverHandler);
    this.element.addEventListener("dragleave", this.dragLeaveHandler);
    this.element.addEventListener("drop", this.dropHandler);
    projectState.addListener((projects: Project[]) => {
      const relevantProject = projects.filter((prj) => {
        if (this.type === `active`) {
          return prj.status === ProjectStatus.Active;
        }
        return prj.status === ProjectStatus.Finished;
      });
      this.assignedProjects = relevantProject;
      this.renderProjects();
    });
  }

  renderLayout() {
    const listId = `${this.type}-projects-list`;
    this.element.querySelector(`ul`)!.id = listId;
    this.element.querySelector(`h2`)!.textContent =
      this.type.toUpperCase() + `PROJECTS`;
  }

  private renderProjects() {
    const listElement = document.getElementById(
      `${this.type}-projects-list`
    )! as HTMLUListElement;
    listElement.innerHTML = ``;
    this.assignedProjects.forEach((projectItem) => {
      new ProjectItems(this.element.querySelector(`ul`)!.id, projectItem);
    });
  }
}

}