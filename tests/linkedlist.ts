/// <reference path="../typings/tsd.d.ts" />
import {LinkedList, Node} from "../src/LinkedList";

describe("The LinkedList class", () => {
    let linkedList : LinkedList<string> = null;

    beforeEach(() => {
        linkedList = new LinkedList<string>();
        linkedList.push(new Node<string>("This"));
        linkedList.push(new Node<string>("is"));
        linkedList.push(new Node<string>("just"));
        linkedList.push(new Node<string>("a"));
        linkedList.push(new Node<string>("test"));
    });

    let verifyList = function (list : LinkedList<string>, expectedValues : string[]) {
        let node = list.head;
        let index = 0;

        while (node != null) {
            if (index == expectedValues.length || node.value != expectedValues[index]) {
                return false;
            }

            node = node.next;
            index++;
        }

        return true;
    }

    let printList = function (list : LinkedList<string>) {
        let node = list.head;
        while (node != null) {
            console.log(node);
            node = node.next;
        }
    }

    describe("The removeNode method", () => {
        it("correctly removes nodes from the middle of the list", () => {
            // Arrange
            let expectedValues = ["This", "is", "a", "test"];
            let node = linkedList.head;
            while (node.value !== "just") node = node.next;

            // Act
            linkedList.removeNode(node);
            
            // Assert
            expect(verifyList(linkedList, expectedValues)).toBeTruthy();
        });

        it("correctly removes nodes from the start of the list", () => {
            // Arrange
            let expectedValues = ["is", "just", "a", "test"];
            
            // Act
            linkedList.removeNode(linkedList.head);

            // Assert
            expect(verifyList(linkedList, expectedValues)).toBeTruthy();
        });

        it("correctly removes nodes immediately after the start of the list", () => {
            // Arrange
            let expectedValues = ["This", "just", "a", "test"];
            let target = linkedList.head.next;
            
            // Act
            linkedList.removeNode(target);

            // Assert
            expect(verifyList(linkedList, expectedValues)).toBeTruthy();
        })

        it("correctly removes nodes from the end of the list", () => {
            // Arrange
            let expectedValues = ["This", "is", "just", "a"];
            
            // Act
            linkedList.removeNode(linkedList.tail);

            // Assert
            expect(verifyList(linkedList, expectedValues)).toBeTruthy();
        });        
    });

    describe("The insertAfter method", () => {
        it("correctly inserts nodes in the middle of the list", () => {
            // Arrange
            let expectedValues = ["This", "is", "just", "about", "a", "test"];
            let nodeToInsert = new Node("about");
            let node = linkedList.head;
            while (node.value !== "just") node = node.next;

            // Act
            linkedList.insertAfter(nodeToInsert, node);

            // Assert
            expect(verifyList(linkedList, expectedValues)).toBeTruthy();
        });

        it("correctly inserts nodes after the start of the list", () => {
            // Arrange
            let expectedValues = ["This", "was", "is", "just", "a", "test"];
            let targetNode = linkedList.head;
            let nodeToInsert = new Node("was");

            // Act
            linkedList.insertAfter(nodeToInsert, targetNode);

            // Assert
            expect(verifyList(linkedList, expectedValues)).toBeTruthy();
        });

        it("correctly inserts nodes after the end of the list", () => {
            // Arrange
            let expectedValues = ["This", "is", "just", "a", "test", "run"];
            let targetNode = linkedList.tail;
            let nodeToInsert = new Node("run");

            // Act
            linkedList.insertAfter(nodeToInsert, targetNode);

            // Assert
            expect(verifyList(linkedList, expectedValues)).toBeTruthy();
        });

        it("correctly sets up a bi-directional link between the target node and the insertee", () => {
            // Arrange
            let insertee = new Node("was");
            let target = linkedList.head;

            // Act
            linkedList.insertAfter(insertee, target);

            // Assert
            expect(target.next).toBe(insertee);
            expect(insertee.previous).toBe(target);
        });

        it("correctly sets up a bi-directional link between the target node's immediate sibling and the insertee", () => {
            // Arrange
            let insertee = new Node("was");
            let target = linkedList.head;
            let sibling = target.next;

            // Act
            linkedList.insertAfter(insertee, target);

            // Assert
            expect(insertee.next).toBe(sibling);
            expect(sibling.previous).toBe(insertee);
        });
    });

    describe("The replaceNode method", () => {
        it("correctly replaces nodes at the start of the list", () => {
            
            // Arrange
            let expectedValues = ["What?!", "is", "just", "a", "test"];
            let targetNode = linkedList.head;
            let nodeToInsert = new Node("What?!");

            // Act
            linkedList.replaceNode(nodeToInsert, targetNode);

            // Assert
            expect(verifyList(linkedList, expectedValues)).toBeTruthy();
        });

        it("correctly replaces nodes immediately after the start of the list", () => {
            // Arrange
            let expectedValues = ["This", "was", "just", "a", "test", "run"];
            let targetNode = linkedList.head.next;
            let nodeToInsert = new Node("was");

            // Act
            linkedList.replaceNode(nodeToInsert, targetNode);

            // Assert
            expect(verifyList(linkedList, expectedValues)).toBeTruthy();
        });
    });
});