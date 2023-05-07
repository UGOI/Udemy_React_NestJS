export class PaginatedResult {
    data: any[];
    meta: {
        total: number,
        per_page: number,
        current_page: number,
        last_page: number,
        next_page_url: string,
        prev_page_url: string,
    }
}