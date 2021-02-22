module.exports = () => {

  const addPrefix = function(selector, prefix) {
    return selector.replace(".", "." + prefix);
  }

  const addPseudo = function(selector, pseudo = "hover", prefix = "hover-") {
    return addPrefix(selector, prefix) + ":" + pseudo;
  }

  return {
    transform: function(rule) {
      this.nodes = this.nodes || [];
      const variant = rule.clone()
      variant.selectors = variant.selectors.map(selector => {
        return addPseudo(selector) + ", " + addPseudo(selector, "focus");
      });
      variant.raws.before = "\n" + rule.parent.raws.before;
      this.nodes.push(variant);
    },
    getNodes: function() {
      const nodes = Object.values(this.nodes);
      delete this.nodes;
      return nodes;
    }
  }
}
