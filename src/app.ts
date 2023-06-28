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

type Listener<T> = (items: T[]) => void;

class State<T> {

    protected listeners: Listener<T>[] = [];
    addListener(listenerFn: Listener<T>) {
        this.listeners.push(listenerFn);
      }
}

//Project State Class
class ProjectState extends State<Project>{
  private projects: Project[] = [];
  private static instance: ProjectState;

  private constructor() {
    super()
  }
  static getInstance() {
    if (this.instance) {
      return this.instance;
    } else {
      this.instance = new ProjectState();
      return this.instance;
    }
  }

 

  addProject(title: string, description: string, amtPeople: number) {
    const newProject = new Project(
      Math.random().toString(),
      title,
      description,
      amtPeople,
      ProjectStatus.Active
    );
    // {
    //   id: Math.random().toString(),
    //   title: title,
    //   description: description,
    //   amtPeople: amtPeople,
    // };
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

abstract class ModularComponent<T extends HTMLElement, U extends HTMLElement> {
  templateEl: HTMLTemplateElement;
  hostEl: T;
  element: U;

  constructor(
    templateId: string,
    hostElementId: string,
    insertStart: boolean,
    newElementId?: string
  ) {
    this.templateEl = document.getElementById(
      templateId
    )! as HTMLTemplateElement;
    this.hostEl = document.getElementById(hostElementId)! as T;

    const importHtmlNode = document.importNode(this.templateEl.content, true);
    this.element = importHtmlNode.firstElementChild as U;
    if (newElementId) {
      this.element.id = newElementId;
    }
    this.attachEl(insertStart);
  }
  private attachEl(inAtStart: boolean) {
    this.hostEl.insertAdjacentElement(
      inAtStart ? `afterbegin` : `beforeend`,
      this.element
    );
  }
  abstract configure(): void;
  abstract renderLayout(): void;
}

class ProjectList extends ModularComponent<HTMLDivElement, HTMLElement> {
  assignedProjects: Project[];

  constructor(private type: `active` | `finished`) {
    super(`project-list`, `app`, false, `${type}-projects`);

    this.assignedProjects = [];

    this.configure();
    this.renderLayout();
  }
  configure(): void {
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
      const listItem = document.createElement(`li`);
      listItem.textContent = projectItem.title;
      listElement.appendChild(listItem);
    });
  }
}

class ProjectInput extends ModularComponent<HTMLDivElement, HTMLFormElement> {
  titleEl: HTMLInputElement;
  descEl: HTMLInputElement;
  peopleEl: HTMLInputElement;

  constructor() {
    super(`project-input`, `app`, true, `user-input`);

    this.titleEl = this.element.querySelector(`#title`) as HTMLInputElement;
    this.descEl = this.element.querySelector(
      `#description`
    ) as HTMLInputElement;
    this.peopleEl = this.element.querySelector(`#people`) as HTMLInputElement;

    this.configure();
  }

  configure() {
    this.element.addEventListener(`submit`, this.submitHandler);
  }

  renderLayout(): void {}

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
}
const newProject = new ProjectInput();
const activeProjects = new ProjectList(`active`);
const finishedProjects = new ProjectList(`finished`);
