import baseMenu from './baseMenu.json'
import pkg from './package.json'

const handleMenu = (menus: any[]): any[] => menus.map(item => ({
    ...item,
    children: item.children ? handleMenu(item.children) : undefined,
    options: { appName: pkg.id || pkg.name, ...item.options }
}))

export default () => {
    return handleMenu(baseMenu)
}
