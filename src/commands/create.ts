const action = (projectName: string) => {
  console.log(`projectName: ${projectName}`)
}

export default {
  command: 'create <project-name>',
  descriptor: 'create a project',
  optionList: [['--context <context>', '上下文路径']],
  action
}