module.exports = (opts = { }) => {

  opts.plugins = opts.plugins || {};

  const defaultPlugins = {
    hover: require("./variants/hover")(),
    responsive: require("./variants/responsive")()
  }

  opts.plugins = Object.assign({}, defaultPlugins, opts.plugins)

  const allVariants = Object.keys(opts.plugins);

  const getNodes = function(variants) {
    return variants.map(variant => {
      return opts.plugins[variant].getNodes();
    }).reduce((accumulator, current) => {
      return [...accumulator, ...current];
    }, []);
  }

  const processAtRules = function(parent, postcss) {
    parent.walkAtRules("variants", function(atRule) {
      const variants = atRule.params.length ? atRule.params.split(/, ?/) : [];
      variants.forEach(variant => {
        if (allVariants.indexOf(variant) == -1) {
          throw new Error(`Variant '${variant}' does not exist.`);
        }
      })
      processAtRules(atRule);
      atRule.walkRules(rule => {
        rule.raws.before = "\n" + atRule.raws.before;
        variants.forEach(variant => {
          opts.plugins[variant].transform(rule, postcss);
        })
      });

      atRule.parent.insertAfter(atRule, getNodes(variants));
      atRule.nodes[0].raws.before = atRule.raws.before;
      atRule.replaceWith(atRule.nodes);
    });
  }

  return {
    postcssPlugin: 'postcss-variants',
    Root (root, postcss) {
      processAtRules(root, postcss);
    }
  }
}
module.exports.postcss = true
