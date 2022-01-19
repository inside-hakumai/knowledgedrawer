import Fuse from 'fuse.js'

let fuse: Fuse<{ title: string; contents: string }> | null = null

export const prepareSearchEngine = (collection: { title: string; contents: string }[]) => {
  fuse = new Fuse(collection, {
    includeScore: true,
    keys: ['title', 'contents'],
  })
}

export const searchKnowledge = (query: string) => {
  if (fuse === null) {
    throw new Error('Fuse instance is not initialized')
  }

  return fuse.search(query)
}
