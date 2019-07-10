const projects = [
  { 
    name: 'Band Poster',
    palettes: [
      {
        name: 'Reggae Colors',
        colors: [
          { id: 1, hexCode: '#FDC58D', isLocked: false },
          { id: 2, hexCode: '#FFFFAA', isLocked: false },
          { id: 3, hexCode: '#95E38A', isLocked: false },
          { id: 4, hexCode: '#779DF2', isLocked: false },
          { id: 5, hexCode: '#D2BEFD', isLocked: false }
        ]
      }
    ]
  },
  { 
    name: 'Website',
    palettes: [
      {
        name: 'Website Colors',
        colors: [
          { id: 1, hexCode: '#FDC58D', isLocked: false },
          { id: 2, hexCode: '#FFFFAA', isLocked: false },
          { id: 3, hexCode: '#95E38A', isLocked: false },
          { id: 4, hexCode: '#779DF2', isLocked: false },
          { id: 5, hexCode: '#D2BEFD', isLocked: false }
        ]
      }
    ]
  }
]

const user = {
  username: 'kanyewest',
  password: 'northwest'
}

module.exports = {
  projects,
  user
}