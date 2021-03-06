/**
 * @overview  Project controller.
 * @author    Chao Wang (hit9)
 * @copyright 2015 Eleme, Inc. All rights reserved.
 */

app.controller('project', function(self, handlers, util) {
  //------------------------------------------------------
  // HTML DOM Selectors
  //------------------------------------------------------
  var dom = {};
  dom.create = {};
  dom.create.form = $('.project-create form');
  dom.list = {};
  dom.list.list = $('.project-list .list-group');
  dom.list.template = $('.project-list #template-project-node');
  //------------------------------------------------------
  // Event Handlers
  //------------------------------------------------------
  /**
   * Entry.
   */
  self.init = function() {
    self.list();
    self.initCreate();
  };
  /**
   * Append project to list.
   * @param {Object} project
   * @param {String} speed
   */
  self.append = function(project, speed) {
    var template = dom.list.template.html();
    var node = nunjucks.renderString(template, {
      project: project,
      url: util.url
    });
    dom.list.list.append(node);
    var selector = util.format(".project-list li[data-id*=%d]", project.id);
    $(selector).appendTo(dom.list.list).show(speed);
  };
  /**
   * List projects
   */
  self.list = function() {
    handlers.project.getAll(function(err, projects) {
      if (err) {
        handlers.error.error(err);
        return;
      }
      projects.forEach(self.append);
    });
  };
  /**
   * Init create.
   */
  self.initCreate = function() {
    dom.create.form.submit(function(e) {
      e.preventDefault();
      var data = util.collectForm(this);
      var form = this;
      handlers.project.create(data.name, function(err, project) {
        if (err) {
          handlers.error.error(err);
          return;
        }
        self.append(project, 500);
        form.reset();
        handlers.error.ok("Project created");
      });
    });
  };
});
