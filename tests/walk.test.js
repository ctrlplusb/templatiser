const walk = require('../src/walk')

describe('walk', () => {
  const tree = {
    config: {},
    depth: 0,
    templateName: 'default',
    type: 'root',
    directories: [
      {
        config: {},
        depth: 1,
        templateName: 'default',
        name: 'cities',
        path: 'tests/example/cities',
        relativePath: '/cities',
        type: 'directory',
        files: [
          {
            ext: '.txt',
            config: {},
            depth: 1,
            name: 'cape-town',
            path: 'tests/example/cities/cape-town.txt',
            relativePath: '/cities',
            templateName: 'default',
            type: 'file',
          },
          {
            ext: '.txt',
            config: {},
            depth: 1,
            name: 'london',
            path: 'tests/example/cities/london.txt',
            relativePath: '/cities',
            templateName: 'default',
            type: 'file',
          },
        ],
      },
      {
        config: {},
        depth: 1,
        templateName: 'default',
        name: 'food',
        path: 'tests/example/food',
        relativePath: '/food',
        type: 'directory',
        directories: [
          {
            config: {},
            depth: 2,
            templateName: 'default',
            name: 'fruit',
            path: 'tests/example/food/fruit',
            relativePath: '/food/fruit',
            type: 'directory',
            files: [
              {
                ext: '.txt',
                config: {},
                depth: 2,
                name: 'apple',
                path: 'tests/example/food/fruit/apple.txt',
                relativePath: '/food/fruit',
                templateName: 'default',
                type: 'file',
              },
              {
                ext: '.txt',
                config: {},
                depth: 2,
                name: 'banana',
                path: 'tests/example/food/fruit/banana.txt',
                relativePath: '/food/fruit',
                templateName: 'default',
                type: 'file',
              },
            ],
          },
        ],
      },
    ],
    files: [
      {
        ext: '.txt',
        config: {},
        depth: 0,
        name: 'foo',
        path: 'tests/example/foo.txt',
        relativePath: '',
        templateName: 'default',
        type: 'file',
      },
    ],
  }

  it('should visitor all nodes in a depth first manner', () => {
    const actual = []
    walk(tree, ({ name }) => {
      actual.push(name)
    })
    expect(actual).toEqual([
      'cities',
      'cape-town',
      'london',
      'food',
      'fruit',
      'apple',
      'banana',
      'foo',
    ])
  })

  it('should allow visitor to stop walking by returning `false`', () => {
    const actual = []

    walk(tree, ({ name }) => {
      if (name === 'cities' || name === 'apple') {
        return false
      }
      actual.push(name)
      return undefined
    })
    expect(actual).toEqual(['food', 'fruit', 'banana', 'foo'])
  })
})
