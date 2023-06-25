function binder(_: any, _2: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  const adjDesc: PropertyDescriptor = {
    configurable: true,
    get() {
      const boundFunc = originalMethod.bind(this);
      return boundFunc;
    },
  };

  return adjDesc;
}

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
    this.descEl = this.element.querySelector(
      `#description`
    ) as HTMLInputElement;
    this.peopleEl = this.element.querySelector(`#people`) as HTMLInputElement;

    this.configure();
    this.addEl();
  }
  private userInput(): [string, string, number] | void{
    const enterTitle = this.titleEl.value;
    const enterDesc = this.descEl.value;
    const enterPeople = this.peopleEl.value;
    if(enterTitle.trim().length === 0 || enterDesc.trim().length === 0 || enterPeople.trim().length){
        alert(`Invalid input! Please try again!`)
        return
    } else {
        return [enterTitle, enterDesc, +enterPeople]
    }
  }
  @binder
  private submitHandler(e: Event) {
    e.preventDefault();
    console.log(this.titleEl.value);
    const newInput = this.userInput()
    if(Array.isArray(newInput)){
        
    }
  }

  private configure() {
    this.element.addEventListener(`submit`, this.submitHandler);
  }

  private addEl() {
    this.hostEl.insertAdjacentElement(`afterbegin`, this.element);
  }
}

const newProject = new ProjectInput();
