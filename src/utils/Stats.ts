import StatsJs from 'stats.js';

export default class Stats {
  private instance: StatsJs;
  private max = 40;
  private ignoreMaxed = true;
  private active = false;
  private queryCreated!: boolean;
  private render!: {
    context: any;
    extension: any;
    panel: any;
    query?: any;
  };

  constructor(_active = false) {
    this.instance = new StatsJs();
    this.instance.showPanel(3);

    if (_active) {
      this.activate();
    }
  }

  activate() {
    this.active = true;

    document.body.appendChild(this.instance.dom);
  }

  deactivate() {
    this.active = false;

    document.body.removeChild(this.instance.dom);
  }

  setRenderPanel(_context: any) {
    this.render = {
      context: _context,
      extension: this.render.context.getExtension('EXT_disjoint_timer_query_webgl2'),
      panel: this.instance.addPanel(new StatsJs.Panel('Render (ms)', '#f8f', '#212')),
    };

    const webGL2 = typeof WebGL2RenderingContext !== 'undefined' && _context instanceof WebGL2RenderingContext;

    if (!webGL2 || !this.render.extension) {
      this.deactivate();
    }
  }

  beforeRender() {
    if (!this.active) {
      return;
    }

    // Setup
    this.queryCreated = false;
    let queryResultAvailable = false;

    // Test if query result available
    if (this.render.query) {
      queryResultAvailable = this.render.context.getQueryParameter(this.render.query, this.render.context.QUERY_RESULT_AVAILABLE);
      const disjoint = this.render.context.getParameter(this.render.extension.GPU_DISJOINT_EXT);

      if (queryResultAvailable && !disjoint) {
        const elapsedNanos = this.render.context.getQueryParameter(this.render.query, this.render.context.QUERY_RESULT);
        const panelValue = Math.min(elapsedNanos / 1000 / 1000, this.max);

        if (panelValue === this.max && this.ignoreMaxed) {
        } else {
          this.render.panel.update(panelValue, this.max);
        }
      }
    }

    // If query result available or no query yet
    if (queryResultAvailable || !this.render.query) {
      // Create new query
      this.queryCreated = true;
      this.render.query = this.render.context.createQuery();
      this.render.context.beginQuery(this.render.extension.TIME_ELAPSED_EXT, this.render.query);
    }
  }

  afterRender() {
    // End the query (result will be available "later")
    if (this.active && this.queryCreated) {
      this.render.context.endQuery(this.render.extension.TIME_ELAPSED_EXT);
    }
  }

  update() {
    if (this.active) {
      this.instance.update();
    }
  }

  destroy() {
    this.deactivate();
  }
}
