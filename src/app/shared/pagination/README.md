# How to use Pagination

###### Implement the following code in your component HTML file.

`<app-pagination [border]="boolean" [dataPerPage]="number" (currentPage)="someFunction($event)="></app-pagination>`

###### Code explanation:

**1. border** - There are two versions of pagination, border property controls the version set to true/false to see the difference.

**2. dataPerPage** - Pass the amount of data that you want to be shown on each page.

**3. totalData** - Pass the amount of total data,

**Pagination** will calculate the number of pages and return the current page. When the user navigates through the pages, **Pagination** component will update the current page.

**4. currentPage** - You can access the current page number with the **currentPage** property and pass it to your **someFunction** function.
