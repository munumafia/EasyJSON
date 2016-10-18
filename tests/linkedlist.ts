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

    describe("The removeNode method", () => {
        it("Correctly removes nodes from the middle of the list", () => {
            // Arrange
            let expectedValues = ["This", "is", "a", "test"];
            let node = linkedList.head;
            while (node.value !== "just") node = node.next;

            // Act
            linkedList.removeNode(node);
            
            // Assert
            expect(verifyList(linkedList, expectedValues)).toBeTruthy();
        });

        it("Correctly removes nodes from the start of the list", () => {
            // Arrange
            let expectedValues = ["is", "just", "a", "test"];
            
            // Act
            linkedList.removeNode(linkedList.head);

            // Assert
            expect(verifyList(linkedList, expectedValues)).toBeTruthy();
        });

        it("Correctly removes nodes from the end of the list", () => {
            // Arrange
            let expectedValues = ["This", "is", "just", "a"];
            
            // Act
            linkedList.removeNode(linkedList.tail);

            // Assert
            expect(verifyList(linkedList, expectedValues)).toBeTruthy();
        });
    });
});