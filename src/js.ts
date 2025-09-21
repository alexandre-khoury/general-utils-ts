export declare namespace JSUtils {
  export type JSPrimitive = string | number | boolean | null | undefined;
  export type JSArray = JSValue[];
  export interface JSObject {
    [key: string]: JSValue;
  }
  export type JSValue = JSPrimitive | JSObject | JSArray;
}

export class JSUtils {
  /**
   * Removes \n and \r and whitespaces at start/end
   */
  static trimNewLines(str: string) {
    return str.replaceAll('\n', '').replaceAll('\r', '').trim();
  }

  /**
   * Safe hasOwnProperty on unknown
   */
  static canAccess<T, K extends PropertyKey>(
    obj: T,
    prop: K,
  ): obj is T & Record<K, unknown> {
    return Object.prototype.hasOwnProperty.call(obj, prop);
  }

  /**
   * alloc2DArray(2,3) = `[ [ , , ] , [ , , ] ]`
   */
  static alloc2DArray(row: number, col: number) {
    const arr = new Array(row) as unknown[][];
    for (let i = 0; i < row; i++) {
      arr[i] = new Array(col);
    }
    return arr;
  }

  /**
   * Escape unsafe XML characters
   */
  static escapeXML(unsafe: string) {
    return unsafe.replace(/[<>&'"]/g, (c) => {
      switch (c) {
        case '<':
          return '&lt;';
        case '>':
          return '&gt;';
        case '&':
          return '&amp;';
        case "'":
          return '&apos;';
        case '"':
          return '&quot;';
        default:
          return c;
      }
    });
  }

  /**
   * Escape unsafe RegExp characters
   */
  static escapeRegExp(unsafe: string) {
    return unsafe.replace(/[/\-\\^$*+?.()|[\]{}]/g, '\\$&');
  }

  /**
   * Sleep for a given number of milliseconds
   */
  static async sleep(ms: number) {
    return new Promise<void>((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  /**
   * Convert a JSON object to an XML string without declaration
   */
  static jsonToXml(json: JSUtils.JSValue, namespace = ''): string {
    const ns = namespace ? `${namespace}:` : '';
    function processNode(v: JSUtils.JSValue): string {
      if (!v) return '';
      let xml = '';
      if (Array.isArray(v)) {
        return v.map((item) => processNode(item)).join('');
      } else if (typeof v === 'object') {
        for (const key in v) {
          if (JSUtils.canAccess(v, key)) {
            const v2 = v[key];
            if (Array.isArray(v2)) {
              xml += v2
                .map(
                  (item) => `<${ns}${key}>${processNode(item)}</${ns}${key}>`,
                )
                .join('');
            } else if (typeof v2 === 'object') {
              xml += `<${ns}${key}>${processNode(v2)}</${ns}${key}>`;
            } else {
              xml += `<${ns}${key}>${JSUtils.escapeXML(String(v2))}</${ns}${key}>`;
            }
          }
        }
        return xml;
      } else return JSUtils.escapeXML(String(v));
    }
    return processNode(json);
  }

  /**
   * Transforms `{ a: undefined; b: 2 }` to `{ b: 2 }`
   */
  static removeUndefined<T extends object>(obj: T) {
    const result: Partial<T> = {};
    for (const key in obj) {
      if (JSUtils.canAccess(obj, key) && obj[key] !== undefined) {
        (result as T)[key] = obj[key] as T[Extract<keyof T, typeof key>];
      }
    }
    return result as {
      [K in keyof T]: Exclude<T[K], undefined>;
    };
  }

  static firstLetterUppercase = (str: string) =>
    str
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
}

// console.log(JSUtils.jsonToXml({ test: { a: 2 }, b: ['asd', 'asf'] }, 'ns1'));
// console.log(JSUtils.jsonToXml([{ test: null }], 'ns1'));
