export default class CopySheet {
  protected settings;
  protected name;

  public constructor(name, settings) {

    this.name = name;
    this.settings = settings;

    this.shouldInterceptWS = false;
    this.shouldInterceptXHR = false;
    this.shouldInterceptReact = false;
}

  // this can be used by the plugins that only need an enable/disable switch
    public static GenerateSettingsFromForm(current, newSettings) {
        current = current || {};
        current.enabled = !!newSettings && newSettings.enabled === "1";
        return current;
    }

protected setLocalValue(key, value) {
    this.setValue(key, value, this.name);
}

protected getLocalValue(key) {
    return this.getValue(key, this.name);
}

protected setGlobalValue(key, value) {
    this.setValue(key, value);
}

protected getGlobalValue(key) {
    return this.getValue(key);
}


private setValue(key, value, namespace) {
    const w = window as any;
    if (!w.Refined) {
        w.Refined = {};
    }

    let dest = w.Refined;
    if (namespace) {
        if (!w.Refined[namespace]) {
            w.Refined[namespace] = {};
        }
        dest = w.Refined[namespace];
    }
    dest[key] = value;
}

private getValue(key, namespace) {
    const w = window;
    if (!w.Refined) {
        return undefined;
    }

    let source = w.Refined;
    if (namespace) {
        if (!w.Refined[namespace]) {
            return undefined;
        }
        source = w.Refined[namespace];
    }
    return source[key];
  }
}
