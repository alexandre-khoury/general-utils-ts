import { JsonValue } from 'type-fest';
import { json2xml, xml2json } from 'xml-js';

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
  static jsonToXml(json: JsonValue, ns?: string): string {
    return json2xml(JSON.stringify(json), {
      compact: true,
      elementNameFn: (x) => (ns ? `${ns}:${x}` : x),
    });
  }

  /**
   * Convert an XML string to a JSON object with strings only
   */
  static xmlToJson(xml: string): string {
    const removeJsonTextAttribute = (value: string, parentElement: any) => {
      try {
        if (!parentElement) return;
        const parentOfParent = parentElement['_parent'];
        const pOpKeys = Object.keys(parentOfParent);
        const keyNo = pOpKeys.length;
        const keyName = pOpKeys[keyNo - 1]!;
        const arrOfKey = parentOfParent[keyName];
        const arrOfKeyLen = arrOfKey.length;
        if (arrOfKeyLen > 0) {
          const arr = arrOfKey;
          const arrIndex = arrOfKey.length - 1;
          arr[arrIndex] = value;
        } else {
          parentOfParent[keyName] = value;
        }
      } catch (e) {}
    };
    return JSON.parse(
      xml2json(xml, {
        compact: true,
        textFn: removeJsonTextAttribute,
      }).replaceAll('{}', '""'),
    );
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
