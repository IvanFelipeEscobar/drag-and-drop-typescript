export abstract class ModularComponent<
  T extends HTMLElement,
  U extends HTMLElement
> {
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
