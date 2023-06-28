namespace App {

  export class ProjectInput extends ModularComponent<HTMLDivElement, HTMLFormElement> {
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

    renderLayout() {}

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
}