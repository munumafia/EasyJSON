export class Node<TValue> {
    public previous : Node<TValue>;
    public next : Node<TValue>;
    public value: TValue;

    public constructor(value : TValue) {
        this.value = value;
    }
}

export class LinkedList<TValue> {
    public head : Node<TValue> = null;
    public tail : Node<TValue> = null;

    public insertBefore(insertee : Node<TValue>, target : Node<TValue>) {
        this.checkInsertArguments(insertee, target);
        
        // Insert before the head of the list
        if (!target.previous) {
            insertee.next = target;
            this.head = insertee;
            
            return;
        }

        target.previous.next = insertee;
        insertee.next = target;
    }

    public insertAfter(insertee : Node<TValue>, target : Node<TValue>) {
        this.checkInsertArguments(insertee, target);

        // Insert after the end of the list
        if (!target.next) {
            target.next = insertee;
            insertee.previous = target;
            this.head = insertee;

            return;
        }

        insertee.next = target.next;
        insertee.previous = target;
        target.next = insertee;
    }

    public push(newNode : Node<TValue>) {
        // Empty list
        if (!this.head) {
            this.head = newNode;
            this.tail = this.head;
        }

        newNode.previous = this.tail;
        this.tail.next = newNode;
        this.tail = newNode;        
    }

    public pop() : Node<TValue> {
        if (!this.tail) throw "Can't pop elements from an empty list";

        if (this.head === this.tail) {
            let popped = this.head;
            this.head == null;
            this.tail == null;

            return popped;
        }

        let popped = this.tail;
        this.tail = this.tail.previous;
        this.tail.next = null;

        return popped;
    }

    public removeNode(node : Node<TValue>) {
        // Single element in the list
        if (this.head === this.tail) {
            this.head = null;
            this.tail = null;
        }

        if (node === this.tail) { 
            this.tail = node.previous;
            this.tail.next = null;
        }

        if (node === this.head) {
            this.head = node.next;
            this.head.previous = null;
        }

        node.next = null;
        node.previous = null;        
    }

    private checkInsertArguments(insertee : Node<TValue>, target : Node<TValue>) {
        if (!this.head) throw "Can't insert into an empty list";
        if (!insertee) throw "The node to be inserted can't be null";
        if (!target) throw "The node to insert the new node before can't be null";
        if (insertee === target) throw "Can't insert a node before itself";
        if (insertee.previous || insertee.next) {
            throw "The node to be inserted has either a previous node or next node, you can only insert a new node";
        }
    }
}
