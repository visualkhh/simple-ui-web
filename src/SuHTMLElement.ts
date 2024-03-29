import { CustomElement } from 'type/type';

export abstract class SuHTMLElement<T = any> extends HTMLElement  implements CustomElement<SuHTMLElement> {
  protected attributeMap = new Map<string, string>();
  protected data?: T;
  abstract render(): void


  private resizeObserver?: ResizeObserver;
  private mutationObserver?: MutationObserver;
  constructor(private config?: {mutationObserverInit: MutationObserverInit, resizeObserve?: boolean | ResizeObserverOptions}) {
    super();
    if (config?.mutationObserverInit) {
      this.mutationObserver = new MutationObserver(this.onMutation.bind(this));
    }
    if (config?.resizeObserve) {
      this.resizeObserver = new ResizeObserver(this.onResize.bind(this));
    }
  }

  static observedAttributes: string[];

  // DOM에 추가되었다. 렌더링 등의 처리.
  connectedCallback() {
    console.log('-->', 'connectedCallback');
    if (this.mutationObserver && this.config?.mutationObserverInit) {
      this.mutationObserver.observe(this, this.config.mutationObserverInit);
    }
    if(this.resizeObserver && this.config?.resizeObserve) {
      this.resizeObserver.observe(this, typeof this.config.resizeObserve === 'boolean' ? undefined : this.config.resizeObserve);
    }
    // this.addEvent()
    // this.render();
  }

  // DOM에서 제거되었다. 엘리먼트를 정리하.
  disconnectedCallback() {
    console.log('-->', 'disconnectedCallback');
    this.mutationObserver?.disconnect();
    this.resizeObserver?.unobserve(this);
  }
  // 사용자 정의 요소가 새 문서로 이동될 때 호출됩니다.
  adoptedCallback() {
    console.log('-->', 'adoptedCallback');

  }

  // 속성이 추가/제거/변경되었다.
  // class에서의 this는 Custom Elements의 인스턴스를 가르키고 있습니다.
  attributeChangedCallback(attrName:string, oldVal: string, newVal: string) {
    console.log('-->', 'attributeChangedCallback');
    this.attributeMap.set(attrName, newVal);
    // this.render();
  }

  onMutation(mutations: MutationRecord[], observer: MutationObserver) {
  }

  onResize(entries: ResizeObserverEntry[], observer: ResizeObserver) {
  }

  setData(data: T) {
    this.data = data;
    // this.dataChangedCallback(this.data);
  }

  // dataChangedCallback(data: T) {
    // this.render();
  // }



  // private addEvent() {
    // this.dispatchEvent(new CustomEvent('on-load-app', {detail: {data: this}}));
  // }

  protected clear() {
    this.innerHTML = '';
  }
}