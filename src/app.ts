// Project Type
enum ProjectStatus {
  Active,
  Finished,
}

class Project {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public people: number,
    public status: ProjectStatus
  ) {}
}
//Project State Class
class ProjectState {
  private listeners: any[] = [];
  private projects: any[] = [];
  private static instance: ProjectState;

  private constructor() {}
  static getInstance() {
    if (this.instance) {
      return this.instance;
    } else {
      this.instance = new ProjectState();
      return this.instance;
    }
  }

  addListener(listenerFn: Function) {
    this.listeners.push(listenerFn);
  }

  addProject(title: string, description: string, amtPeople: number) {
    const newProject = {
      id: Math.random().toString(),
      title: title,
      description: description,
      amtPeople: amtPeople,
    };
    this.projects.push(newProject);
    this.listeners.forEach((lFn) => lFn(this.projects.slice()));
  }
}

const projectState = ProjectState.getInstance();

interface ValidInput {
  value: string | number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

const validate = (inputToValidate: ValidInput) => {
  let isValid = true;
  if (inputToValidate.required) {
    isValid = isValid && inputToValidate.value.toString().trim().length != 0;
  }
  if (
    inputToValidate.minLength != null &&
    typeof inputToValidate.value === `string`
  ) {
    isValid =
      isValid && inputToValidate.value.length >= inputToValidate.minLength;
  }
  if (
    inputToValidate.maxLength != null &&
    typeof inputToValidate.value === `string`
  ) {
    isValid =
      isValid && inputToValidate.value.length <= inputToValidate.maxLength;
  }
  if (
    inputToValidate.min != null &&
    typeof inputToValidate.value === `number`
  ) {
    isValid = isValid && inputToValidate.value >= inputToValidate.min;
  }
  if (
    inputToValidate.max != null &&
    typeof inputToValidate.value === `number`
  ) {
    isValid = isValid && inputToValidate.value <= inputToValidate.max;
  }
  return isValid;
};

const binder = (_: any, _2: string, descriptor: PropertyDescriptor) => {
  const originalMethod = descriptor.value;
  const adjDesc: PropertyDescriptor = {
    configurable: true,
    get() {
      const boundFunc = originalMethod.bind(this);
      return boundFunc;
    },
  };

  return adjDesc;
};

class ProjectList {
  templateEl: HTMLTemplateElement;
  hostEl: HTMLDivElement;
  element: HTMLElement;
  assignedProjects: any[];

  constructor(private type: `active` | `finished`) {
    this.templateEl = document.getElementById(
      `project-list`
    )! as HTMLTemplateElement;
    this.hostEl = document.getElementById(`app`)! as HTMLDivElement;

    this.assignedProjects = [];
    const importHtmlNode = document.importNode(this.templateEl.content, true);
    this.element = importHtmlNode.firstElementChild as HTMLElement;
    this.element.id = `${type}-projects`;

    projectState.addListener((projects: any[]) => {
      this.assignedProjects = projects;
      this.renderProjects();
    });

    this.attachEl();
    this.renderLayout();
  }

  private renderProjects() {
    const listElement = document.getElementById(
      `${this.type}-projects-list`
    )! as HTMLUListElement;
    this.assignedProjects.forEach((projectItem) => {
      const listItem = document.createElement(`li`);
      listItem.textContent = projectItem.title;
      listElement.appendChild(listItem);
    });
  }

  private renderLayout() {
    const listId = `${this.type}-projects-list`;
    this.element.querySelector(`ul`)!.id = listId;
    this.element.querySelector(`h2`)!.textContent =
      this.type.toUpperCase() + `PROJECTS`;
  }

  private attachEl() {
    this.hostEl.insertAdjacentElement(`beforeend`, this.element);
  }
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

  private userInput(): [string, string, number] | void {
    const enterTitle = this.titleEl.value;
    const enterDesc = this.descEl.value;
    const enterPeople = this.peopleEl.value;

    const titleValidation: ValidInput = {
      value: enterTitle,
      required: true,
      maxLength: 25,
      minLength: 3,
    };

    const descValidation: ValidInput = {
      value: enterDesc,
      required: true,
      maxLength: 100,
      minLength: 3,
    };

    const peopleValidation: ValidInput = {
      value: +enterPeople,
      required: true,
      max: 10,
      min: 1,
    };

    if (
      //   enterTitle.trim().length === 0 ||
      //   enterDesc.trim().length === 0 ||
      //   enterPeople.trim().length === 0
      !validate(titleValidation) ||
      !validate(descValidation) ||
      !validate(peopleValidation)
    ) {
      alert(`Invalid input! Please try again!`);
      return;
    } else {
      return [enterTitle, enterDesc, +enterPeople];
    }
  }
  private clearInput() {
    this.titleEl.value = ``;
    this.descEl.value = ``;
    this.peopleEl.value = ``;
  }

  @binder
  private submitHandler(e: Event) {
    e.preventDefault();
    // console.log(this.titleEl.value);
    const newInput = this.userInput();
    if (Array.isArray(newInput)) {
      const [title, desc, people] = newInput;
      // console.log(title, desc, people)
      projectState.addProject(title, desc, people);
      this.clearInput();
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
const activeProjects = new ProjectList(`active`);
const finishedProjects = new ProjectList(`finished`);
