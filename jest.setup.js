import '@testing-library/jest-dom';

// Mock fetch globally
global.fetch = jest.fn();

// Mock NextRequest for API tests
global.NextRequest = class NextRequest {
  constructor(url, init = {}) {
    this.url = url;
    this.method = init.method || 'GET';
    this.headers = new Map();
    this.body = init.body;
  }

  async json() {
    return JSON.parse(this.body || '{}');
  }

  async text() {
    return this.body || '';
  }
};

// Mock Request for API tests
global.Request = class Request {
  constructor(url, init = {}) {
    this.url = url;
    this.method = init.method || 'GET';
    this.headers = new Map();
    this.body = init.body;
  }

  async json() {
    return JSON.parse(this.body || '{}');
  }

  async text() {
    return this.body || '';
  }
};

// Mock Response for API tests
global.Response = class Response {
  constructor(body, init = {}) {
    this.body = body;
    this.status = init.status || 200;
    this.statusText = init.statusText || 'OK';
    this.headers = new Map();
  }

  async json() {
    return JSON.parse(this.body || '{}');
  }

  async text() {
    return this.body || '';
  }
};

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock document.documentElement.style to prevent WebkitAnimation issues
Object.defineProperty(document.documentElement, 'style', {
  writable: true,
  value: new Proxy(
    {},
    {
      get: () => '',
      set: () => true,
      has: () => false,
    }
  ),
});

// Mock HTMLElement.prototype.style
Object.defineProperty(HTMLElement.prototype, 'style', {
  writable: true,
  value: new Proxy(
    {},
    {
      get: () => '',
      set: () => true,
      has: () => false,
    }
  ),
});

// Mock Element.prototype.style
Object.defineProperty(Element.prototype, 'style', {
  writable: true,
  value: new Proxy(
    {},
    {
      get: () => '',
      set: () => true,
      has: () => false,
    }
  ),
});

// Mock CSS.supports to prevent WebkitAnimation issues
Object.defineProperty(window, 'CSS', {
  writable: true,
  value: {
    supports: jest.fn().mockReturnValue(false),
  },
});

// Mock getComputedStyle to return empty style object
Object.defineProperty(window, 'getComputedStyle', {
  writable: true,
  value: jest.fn().mockReturnValue({
    getPropertyValue: () => '',
    setProperty: () => {},
    removeProperty: () => {},
  }),
});

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock requestAnimationFrame and cancelAnimationFrame
global.requestAnimationFrame = jest.fn((cb) => setTimeout(cb, 0));
global.cancelAnimationFrame = jest.fn((id) => clearTimeout(id));

// Mock scrollTo
global.scrollTo = jest.fn();

// Mock HTMLElement.prototype.getBoundingClientRect
HTMLElement.prototype.getBoundingClientRect = jest.fn(() => ({
  width: 0,
  height: 0,
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
  x: 0,
  y: 0,
}));

// Mock the specific function that's causing WebkitAnimation issues
const originalGetComputedStyle = window.getComputedStyle;
window.getComputedStyle = jest.fn((element) => {
  const mockStyle = {
    getPropertyValue: jest.fn().mockReturnValue(''),
    setProperty: jest.fn(),
    removeProperty: jest.fn(),
    length: 0,
    item: jest.fn(),
    getPropertyPriority: jest.fn().mockReturnValue(''),
    cssText: '',
    parentRule: null,
  };

  // Add all CSS properties as empty strings to prevent 'in' operator issues
  const cssProperties = [
    'WebkitAnimation',
    'WebkitAnimationName',
    'WebkitAnimationDuration',
    'WebkitAnimationTimingFunction',
    'WebkitAnimationDelay',
    'WebkitAnimationIterationCount',
    'WebkitAnimationDirection',
    'WebkitAnimationFillMode',
    'WebkitAnimationPlayState',
    'animation',
    'animationName',
    'animationDuration',
    'animationTimingFunction',
    'animationDelay',
    'animationIterationCount',
    'animationDirection',
    'animationFillMode',
    'animationPlayState',
  ];

  cssProperties.forEach((prop) => {
    Object.defineProperty(mockStyle, prop, {
      value: '',
      writable: true,
      enumerable: true,
      configurable: true,
    });
  });

  return mockStyle;
});

// Mock the specific function that's causing the WebkitAnimation issue
// We need to mock this before any React DOM code runs
const mockGetComputedStyle = jest.fn().mockImplementation((element) => {
  const mockStyle = {
    getPropertyValue: jest.fn().mockReturnValue(''),
    setProperty: jest.fn(),
    removeProperty: jest.fn(),
    length: 0,
    item: jest.fn(),
    getPropertyPriority: jest.fn().mockReturnValue(''),
    cssText: '',
    parentRule: null,
  };

  // Add all CSS properties as empty strings to prevent 'in' operator issues
  const cssProperties = [
    'WebkitAnimation',
    'WebkitAnimationName',
    'WebkitAnimationDuration',
    'WebkitAnimationTimingFunction',
    'WebkitAnimationDelay',
    'WebkitAnimationIterationCount',
    'WebkitAnimationDirection',
    'WebkitAnimationFillMode',
    'WebkitAnimationPlayState',
    'animation',
    'animationName',
    'animationDuration',
    'animationTimingFunction',
    'animationDelay',
    'animationIterationCount',
    'animationDirection',
    'animationFillMode',
    'animationPlayState',
  ];

  cssProperties.forEach((prop) => {
    Object.defineProperty(mockStyle, prop, {
      value: '',
      writable: true,
      enumerable: true,
      configurable: true,
    });
  });

  return mockStyle;
});

// Override getComputedStyle globally
Object.defineProperty(window, 'getComputedStyle', {
  writable: true,
  value: mockGetComputedStyle,
});

// Mock the specific function that's causing the issue
// This is a more direct approach to fix the WebkitAnimation issue
const originalGetVendorPrefixedEventName =
  require('react-dom').__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED
    ?.getVendorPrefixedEventName;
if (originalGetVendorPrefixedEventName) {
  require('react-dom').__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.getVendorPrefixedEventName =
    jest.fn().mockImplementation((eventName) => {
      if (eventName === 'animationend') {
        return 'animationend';
      }
      return eventName;
    });
}

// Mock URL.createObjectURL and URL.revokeObjectURL
Object.defineProperty(URL, 'createObjectURL', {
  writable: true,
  value: jest.fn(() => 'blob:mock-url'),
});

// Ensure we have a proper DOM environment for React Testing Library
beforeEach(() => {
  // Create a clean DOM for each test
  document.body.innerHTML = '';
  document.head.innerHTML = '';

  // Create a div element for React to render into
  const div = document.createElement('div');
  div.id = 'root';
  document.body.appendChild(div);
});

afterEach(() => {
  // Clean up after each test
  document.body.innerHTML = '';
  document.head.innerHTML = '';
});

// Mock the specific function that's causing the issue
// This is a more direct approach to fix the WebkitAnimation issue
const originalGetVendorPrefixedEventName =
  require('react-dom').__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED
    ?.getVendorPrefixedEventName;
if (originalGetVendorPrefixedEventName) {
  require('react-dom').__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.getVendorPrefixedEventName =
    jest.fn().mockImplementation((eventName) => {
      if (eventName === 'animationend') {
        return 'animationend';
      }
      return eventName;
    });
}

Object.defineProperty(URL, 'revokeObjectURL', {
  writable: true,
  value: jest.fn(),
});

// Mock document methods
Object.defineProperty(document, 'createElement', {
  writable: true,
  value: jest.fn(() => ({
    href: '',
    download: '',
    click: jest.fn(),
  })),
});

Object.defineProperty(document.body, 'appendChild', {
  writable: true,
  value: jest.fn(),
});

Object.defineProperty(document.body, 'removeChild', {
  writable: true,
  value: jest.fn(),
});

// Mock navigator.clipboard
Object.defineProperty(navigator, 'clipboard', {
  writable: true,
  value: {
    writeText: jest.fn().mockResolvedValue(undefined),
  },
});

// Mock performance.memory
Object.defineProperty(performance, 'memory', {
  writable: true,
  value: {
    usedJSHeapSize: 1000000,
    totalJSHeapSize: 2000000,
    jsHeapSizeLimit: 4000000,
  },
});
