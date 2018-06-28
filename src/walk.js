const walk = (tree, fn, acc) => {
  const recursive = (current, currentDepth, walkAcc) => {
    const depth = currentDepth + 1
    const directoriesAcc = current.directories
      ? current.directories.reduce(
          (directoryAcc, directory) =>
            recursive(directory, depth, fn(directoryAcc, directory)),
          walkAcc,
        )
      : walkAcc
    return current.files
      ? current.files.reduce(
          (fileAcc, file) => fn(fileAcc, file),
          directoriesAcc,
        )
      : directoriesAcc
  }
  return recursive(tree, -1, '', acc)
}

module.exports = walk
