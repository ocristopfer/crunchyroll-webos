import type { Callback, Template } from "./vine.js"
import { $, register, Route, unwatch, watch } from "./vine.js"
import { Api } from "./api.js"

/**
 * Return template
 * @param component
 * @returns
 */
const template: Template = async ({ state }) => {
    return await Api.getTemplate('menu', state)
}

/**
 * Set active menu item
 * @param component
 */
const setActive: Callback = ({ element }) => {

    const path = Route.active()
    const id = path.menuId ? path.menuId : ''

    const next = $('a.link-' + id + '', element)
    const current = $('a.active', element)

    if (current) {
        current.classList.remove('active')
    }
    if (next) {
        next.classList.add('active')
    }

}

/**
 * On mount
 * @param component
 */
const onMount: Callback = (component) => {

    Route.afterChange(() => {
        setActive(component)
    })

    watch('authChanged', async () => {
        await component.render()
        await setActive(component)
    })

}

/**
 * On render
 * @param component
 */
const onRender: Callback = (component) => {
    setActive(component)
}

/**
 * On destroy
 */
const onDestroy: Callback = () => {
    unwatch('authChanged')
}

register('[data-menu]', {
    template,
    onMount,
    onRender,
    onDestroy
})