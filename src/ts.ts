export class TSUtils {
  static assignValueToKeyOfObject<
    OBJ,
    KEY extends keyof OBJ,
    VAL extends OBJ[KEY],
  >(obj: OBJ, prop: KEY, value: VAL) {
    obj[prop] = value;
  }
}
