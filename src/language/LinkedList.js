class LinkedList {
  constructor() {
    this.head = null;
  }
  insertFirst(item) {
    this.head = new _Node(item, this.head);
  }

  insertLast(item) {
    if (this.head === null) {
      this.insertFirst(item);
      return;
    }
    let currentNode = this.head;
    while (currentNode.next !== null) {
      currentNode = currentNode.next;
    }
    currentNode.next = new _Node(item, null);
  }

  find(item) {
    if (this.head === null) return null;
    let currentNode = this.head;
    while (currentNode.val !== item) {
      if (currentNode.next === null) return null;
      currentNode = currentNode.next;
    }
    return currentNode;
  }

  remove(item) {
    if (!this.head) return;
    let currentNode = this.head;
    if (this.head.val === item) {
      this.head = this.head.next;
      return;
    }
    while (currentNode.next !== null) {
      if (currentNode.next.val === item) {
        currentNode.next = currentNode.next.next;
        return;
      }
      currentNode = currentNode.next;
    }
    return "Item not found";
  }

  insertBefore(beforeItem, itemToInsert) {
    if (!this.head) return;
    if (this.head.val === beforeItem) {
      this.insertFirst(itemToInsert);
      return;
    }
    let currentNode = this.head;
    while (currentNode.next !== null && currentNode.next.val !== beforeItem) {
      currentNode = currentNode.next;
    }
    if (currentNode.next === null) return;
    let nextNode = currentNode.next;
    currentNode.next = new _Node(itemToInsert, nextNode);
  }

  insertAfter(afterItem, itemToInsert) {
    if (!this.head) return;
    let currentNode = this.head;
    while (currentNode !== null && currentNode.val !== afterItem) {
      currentNode = currentNode.next;
    }
    if (currentNode === null) return;
    currentNode.next = new _Node(itemToInsert, currentNode.next);
  }

  insertAt(index, item) {
    console.log(this.head)
    if (!this.head) return;
    if (index === 0) this.insertFirst(item);
    let currentNode = this.head;
    let i;
    for (i = 0; i < index - 1 && currentNode !== null; i++) {
      currentNode = currentNode.next;
    }
    currentNode.val.next = item.val.id;
    item.val.next = currentNode.next.val.id;
    currentNode.next = new _Node(item, currentNode.next);
  }
}

class _Node {
  constructor(val, next) {
    this.val = val;
    this.next = next;
  }
}

module.exports = LinkedList;
