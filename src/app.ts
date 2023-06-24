class ProjectInput {
  templateEl: HTMLTemplateElement;
  hostEl: HTMLDivElement;
  element: HTMLFormElement;
  titleEl: HTMLInputElement;
  constructor() {
    this.templateEl = document.getElementById(
      `project-input`
    )! as HTMLTemplateElement;
    this.hostEl = document.getElementById(`app`)! as HTMLDivElement;
    const importHtmlNode = document.importNode(this.templateEl.content, true);
    this.element = importHtmlNode.firstElementChild as HTMLFormElement;
    this.element.id = `user-input`;
    this.addEl();
  }
  private addEl(){
    this.hostEl.insertAdjacentElement(`afterbegin`, this.element)
  }
}
const newProject = new ProjectInput()