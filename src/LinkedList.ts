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

        if (target == this.tail) {
            target.next = insertee;
            insertee.previous = target;
            this.tail = insertee;

            return;
        }

        // Create a bi-directional link between the insertee and the target's 
        // immediate sibling
        insertee.next = target.next;
        insertee.next.previous = insertee;

        // Create a bi-direction link between the target and the insertee
        insertee.previous = target;
        insertee.previous.next = insertee;        
    }

    public push(newNode : Node<TValue>) {
        if (this.head == null) {
            this.head = newNode;
            this.tail = this.head;
            return;
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
            
            return;
        }

        if (node === this.tail) { 
            this.tail = node.previous;
            this.tail.next = null;

            return;
        }

        if (node === this.head) {
            this.head = node.next;
            this.head.previous = null;

            return; 
        }

        node.next.previous = node.previous;
        node.previous.next = node.next;             
    }

    public replaceNode(replaceWith : Node<TValue>, replacee : Node<TValue>) {
        let insertAfter = replacee.previous || this.head;
        
        this.insertAfter(replaceWith, insertAfter);
        this.removeNode(replacee);                
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
