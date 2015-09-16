import React from 'react';
import {findDOMNode} from 'react-dom';

export default function testable(labelsConstructor) {
  return Component => {
    const componentName = Component.displayName || Component.name;

    if (!componentName) {
      throw new Error();
    }

    function markTestElement(name) {
      if (process.env.NODE_ENV === 'test') {
        return {
          'data-test-element': `${componentName}-${name}`,
        };
      }

      return {};
    }

    return class Testable extends React.Component {
      static displayName = `Testable(${componentName})`

      componentDidMount() {
        this.refreshLabels();
      }

      componentDidUpdate() {
        this.refreshLabels();
      }

      refreshLabels() {
        if (process.env.NODE_ENV === 'test') {
          const labels = labelsConstructor
            ? labelsConstructor(this.props)
            : {};

          const componentNode = findDOMNode(this);

          if (!componentNode) {
            return;
          }

          Object.keys(labels)
            .map((key) => {
              const value = labels[key];

              return {
                key: `data-test-label-${key}`,
                value,
              };
            })
            .concat([{
              key: 'data-test-component',
              value: componentName,
            }])
            .reduce((acc, {key, value}) => (
              acc.setAttribute(key, value),
              acc
            ), componentNode);
        }
      }

      render() {
        return (
          <Component
            {...this.props}
            markTestElement={markTestElement}
          />
        );
      }
    };
  };
}
