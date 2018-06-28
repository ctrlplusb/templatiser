const walkPageData = (tree, fn, acc) => {
  const walk = (current, currentDepth, currentSlugPath, walkAcc) => {
    const depth = currentDepth + 1
    const accWithSections = current.directories
      ? current.directories.reduce((sectionAcc, directory) => {
          return walk(directory, depth, fn(sectionAcc, directory))
        }, walkAcc)
      : walkAcc
    return current.files
      ? current.files.reduce((eacc, file) => fn(eacc, file), accWithSections)
      : accWithSections
  }
  return walk(tree, -1, '', acc)
}

module.exports = walkPageData
