({

    doInit: function (component, event, helper) {
        var dataTable = helper.queryElement(component.get('v.body'), 'lightning:datatable');

        if (!dataTable) {
            return
        }

        component.set('v.dataTable', dataTable);

        dataTable.set('v.showRowNumberColumn', true);

        var itemsPerPage = component.get('v.elementsPerPage');

        if (!component.get('v.isRecordsLoadsDynamically')) {
            let items = component.get('v.items');
            let pages = 1;
            if (items.length > 0) {
                pages = helper.calculatePages(items, itemsPerPage);
            }
            component.set('v.pages', pages);
            helper.changeOffsetData(dataTable, items, 0, itemsPerPage);
        } else {
            dataTable.set('v.rowNumberOffset', 0);
            helper.fireOnChangeEvent(component, 0, itemsPerPage)
        }
    },

    onItemsChange: function (component, event, helper) {
        let oldItems = event.getParam('oldValue');
        let items = event.getParam('value');
        if (JSON.stringify(oldItems) === JSON.stringify(items)) {
            return
        }

        helper.recalculatePages(component)
    },

    goToLastPage: function (component, event, helper) {

        let currentPage = component.get('v.currentPage');
        let lastPage = component.get('v.pages')

        if (currentPage != lastPage) {
            let shift = lastPage - currentPage;
            helper.shiftPage(component, shift);
        }
    },

    goToFirstPage: function (component, event, helper) {

        let currentPage = component.get('v.currentPage');

        if (currentPage != 1) {
            helper.shiftPage(component, 1 - currentPage);
        }
    },

    goToPreviousPage: function (component, event, helper) {
        helper.shiftPage(component, -1);
    },

    goToNextPage: function (component, event, helper) {
        helper.shiftPage(component, 1);
    },

    validateElementsPerPage: function (component, event, helper) {
        if (!component.get('v.isRecordsLoadsDynamically')) {
            let elementsPerPage = event.getParam('value')
            if (!elementsPerPage) {
                return
            }
            helper.recalculatePages(component)
        }
    },

    goToSpecificPage: function (component, event, helper) {
        helper.shiftPage(component, 0);
    }

})