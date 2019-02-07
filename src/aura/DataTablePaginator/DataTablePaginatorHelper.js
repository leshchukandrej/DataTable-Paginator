/**
 * Created by ctuser on 05.02.2019.
 */
({
    queryElement: function (items, elementInstanceName) {
        debugger
        if (!Array.isArray(items)) {
            if (!items.isInstanceOf) {
                return
            }
            if (items.isInstanceOf(elementInstanceName)) {
                return items;
            }
        }

        var searchedElement;

        for (var i = 0; i < items.length; i++) {
            var child = items[i];
            if (child) {
                if (child.isInstanceOf(elementInstanceName)) {
                    return child;
                } else if (child.isInstanceOf("lightning:overlayLibrary")) {

                } else if (!child.isInstanceOf("aura:expression")) {
                    if (child.get("v.body").length > 0) {
                        searchedElement = this.queryElement(child.get("v.body"), elementInstanceName);
                    }
                } else if (child.isInstanceOf("aura:expression")) {
                    if (child.get("v.value")) {
                        searchedElement = this.queryElement(child.get("v.value"), elementInstanceName);
                    }
                }
            }

            if (searchedElement) {
                return searchedElement
            }
        }
    },

    recalculatePages: function (component) {

        let dataTable = component.get('v.dataTable')

        if (!dataTable) {
            return
        }

        var items = component.get('v.items');
        var elementsPerPage = component.get('v.elementsPerPage');
        var currentPage = component.get('v.currentPage');

        if (!items || items.length <= elementsPerPage) {
            dataTable.set('v.data', items);
            dataTable.set('v.rowNumberOffset', 0);
            component.set('v.currentPage', 1);
            component.set('v.pages', 1);
            return
        }

        let pages = this.calculatePages(items, elementsPerPage)
        let offset = this.calculateOffset(currentPage, elementsPerPage);

        if (offset + 1 > items.length) {
            if (currentPage != pages) {
                this.changeOffsetData(dataTable, items, this.calculateOffset(pages, elementsPerPage), elementsPerPage);
                component.set('v.currentPage', pages);
            }
        } else {
            this.changeOffsetData(dataTable, items, offset, elementsPerPage);
        }

        component.set('v.pages', pages);
    },

    shiftPage: function (component, shift) {

        let dataTable = component.get('v.dataTable')

        if (!dataTable) {
            return
        }

        var nextPage = parseInt(component.get('v.currentPage')) + shift;

        var pages = component.get('v.pages');

        if (nextPage > pages || nextPage < 1) {
            return
        }

        let itemsPerPage = component.get('v.elementsPerPage');
        let offset = this.calculateOffset(nextPage, itemsPerPage);
        let items;

        if (!component.get('v.isRecordsLoadsDynamically')) {
            items = component.get('v.items');
        } else {
            this.fireOnChangeEvent(component, offset, itemsPerPage)
        }
        this.changeOffsetData(dataTable, items, offset, itemsPerPage);
        component.set('v.currentPage', nextPage);
    },

    fireOnChangeEvent: function (component, offset, itemsPerPage) {
        let onChangePageEvent = component.getEvent("onChangePage");
        onChangePageEvent.setParam('offset', offset);
        onChangePageEvent.setParam('itemsPerPage', itemsPerPage);
        onChangePageEvent.fire();
    },

    calculatePages: function (items, itemsPerPage) {
        if (items.length) {
            return Math.ceil(items.length / itemsPerPage);
        }
        return 1;
    },

    calculateOffset: function (page, itemsPerPage) {
        return (page - 1) * itemsPerPage
    },

    getElementsRange: function (items, offset, itemsPerPage) {
        return items.slice(offset, offset + itemsPerPage)
    },

    changeOffsetData: function (dataTable, items, offset, elementsPerPage) {
        if (items) {
            dataTable.set('v.data', this.getElementsRange(items, offset, elementsPerPage));
        }
        dataTable.set('v.rowNumberOffset', offset);
    }

})