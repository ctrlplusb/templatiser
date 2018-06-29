const walk = (tree, visitor) => {
  const recursive = current => {
    if (current.directories) {
      current.directories.forEach(directory => {
        const visitResult = visitor(directory)
        if (visitResult === false) {
          // do nothing
        } else {
          recursive(directory)
        }
      })
    }

    if (current.files) {
      current.files.forEach(file => {
        visitor(file)
      })
    }
  }
  return recursive(tree)
}

module.exports = walk
