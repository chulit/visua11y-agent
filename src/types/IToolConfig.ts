export default interface IToolConfig {
    id?: string,
    selector?: string,
    childrenSelector?: string[],
    styles?: {
        [key: string]: unknown
    },
    css?: string,
    enable?: boolean
}