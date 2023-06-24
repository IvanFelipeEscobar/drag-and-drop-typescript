class ProjectInput {
  templateEl: HTMLTemplateElement;
  hostEl: HTMLDivElement;
  element: HTMLFormElement;
  titleEl: HTMLInputElement;
  descEl: HTMLInputElement;
  peopleEl: HTMLInputElement;

  constructor() {
    this.templateEl = document.getElementById(
      `project-input`
    )! as HTMLTemplateElement;
    this.hostEl = document.getElementById(`app`)! as HTMLDivElement;
    const importHtmlNode = document.importNode(this.templateEl.content, true);
    this.element = importHtmlNode.firstElementChild as HTMLFormElement;
    this.element.id = `user-input`;
    this.titleEl = this.element.querySelector(`#title`) as HTMLInputElement;
    this.descEl = this.element.querySelector(`#description`) as HTMLInputElement;
    this.peopleEl = this.element.querySelector(`#people`) as HTMLInputElement;
    this.addEl();
  }

  private submitHandler(e: Event){

  }

  private configure() {
    this.element.addEventListener(`submit`, this.submitHandler);
  }

  private addEl() {
    this.hostEl.insertAdjacentElement(`afterbegin`, this.element);
  }
}

const newProject = new ProjectInput();