---
sidebar_position: 2
---

# Interaction

(Item) includes:

- Variable
- Link
- Stock
- Flow
  - Valve
  - Source
  - Sink

## State Diagram

```plantuml
@startuml Interaction
hide empty description

state "Common" as common {
  state "Idle" as idle #yellow
  state "Moving Viewport" as moveViewport : mouse move
  state "Shaping Link" as shapeLink : mouse move
  state "Shaping Flow" as shapeFlow : mouse move

  [*] -> idle
  idle -[#blue]-> shapeLink : down \n on Link
  shapeLink -up-> idle : up

  idle -[#blue]-> shapeFlow : down \n on Flow \n / Valve \n / Source \n / Sink
  shapeFlow -up-> idle : up

  idle -[#green]-> moveViewport : down \n on background
  moveViewport -up-> idle : up

}

state "Edit (Item) Window" as editWindow {
  state "Idle" as idleEdit #yellow
  'state "(Item) Selected" as selected
  state "(Item) Editing" as editing : show edit window

  [*] -> idleEdit
  idleEdit -[#brown]-> editing : click \n on (Item)
  'idleEdit -[#brown]-> selected : click \n on (Item)
  'selected -up[#brown]-> idleEdit : click \n on background
  'selected -[#brown]> editing : click \n on (Item) \n (after 1 sec)
  editing -up[#brown]-> idleEdit : click \n on background \n : hide window
}

state "Delete (Item) Mode" as deleteItemMode {
  state "Idle" as idleDelete #yellow
  state ": delete (Item)" as deleteItem #white ##white

  [*] -> idleDelete
  idleDelete -[#purple]-> deleteItem : double click \n on (Item)
  deleteItem -up-> idleDelete

}

state "Create Variable" as createVariableMode {
  state "Idle" as idleCreateVariable #yellow
  state ": create Variable" as createVariable #white ##white

  [*] -> idleCreateVariable
  idleCreateVariable -[#purple]-> createVariable : double click \n on background
  createVariable -up-> idleCreateVariable

}

state "Create Stock" as createStockMode {
  state "Idle" as idleCreateStock #yellow
  state ": create Stock" as createStock #white ##white

  [*] -> idleCreateStock
  idleCreateStock -[#purple]-> createStock : double click \n on background
  createStock -up-> idleCreateStock

}

state "Not Delete (Item) Mode" as notDeleteItemMode {
  state "Idle" as idleNotDeleteItemMode #yellow
  state "Editing Text" as editText : show edit box
  state ": toggle direction" as toggleDirection #white ##white

  [*] --> idleNotDeleteItemMode
  idleNotDeleteItemMode -[#purple]-> editText : double click \n on Varialble \n / Stock
  editText -up-> idleNotDeleteItemMode : press enter \n in edit box

  idleNotDeleteItemMode -[#purple]-> toggleDirection : double click \n on Flow
  toggleDirection -up-> idleNotDeleteItemMode

  state "Toggle Link Direction Mode" as toggleLinkDirectionMode {
    state "Idle" as idleLinkDirection #yellow
    state ": toggle direction" as toggleLinkDirection #white ##white

    [*] -> idleLinkDirection
    idleLinkDirection -[#purple]-> toggleLinkDirection : double click \n on Link
    toggleLinkDirection -up-> idleLinkDirection

  }

  state "Toggle Link Relation Mode" as toggleLinkRelationMode {
    state "Idle" as idleLinkRelation #yellow
    state ": toggle relation" as toggleLinkRelation #white ##white

    [*] -> idleLinkRelation
    idleLinkRelation -[#purple]-> toggleLinkRelation : double click \n on Link
    toggleLinkRelation -up-> idleLinkRelation

  }

  [*] -> toggleLinkRelationMode

}

state "Move Variable / Stock Mode" as modeMoveVariableStock {
  state "Idle" as idleMoveVariable #yellow
  state "Moving Variable" as moveVariable : mouse move
  state "Moving Stock" as moveStock : mouse move

  [*] -> idleMoveVariable

  idleMoveVariable -[#blue]-> moveVariable : down \n on Variable
  moveVariable -up-> idleMoveVariable : up

  idleMoveVariable -[#blue]-> moveStock : down \n on Stock
  moveStock -up-> idleMoveVariable : up

}

state "Add Link / Flow Mode" as modeAddLinkFlow {
  state "Idle" as idleAddLink #yellow
  state "Dragging New \n Link / Flow" as dragNewLinkFlow : mouse move
  state ": create Link" as addLink #white ##white
  state ": create Flow" as addFlow #white ##white

  [*] -> idleAddLink

  idleAddLink -[#blue]-> dragNewLinkFlow : down \n on Variable \n / Stock

  dragNewLinkFlow -left> addLink : up \n on Variable \n / Valve \n from Variable
  dragNewLinkFlow -left> addLink : up \n on Variable \n from Stock
  addLink -up-> idleAddLink

  dragNewLinkFlow -> addFlow : up \n on Stock \n / background \n from Stock
  addFlow -up-> idleAddLink

}

[*] -up-> createVariableMode
createVariableMode -> createStockMode
createStockMode -left> createVariableMode

[*] -> notDeleteItemMode
toggleLinkRelationMode -> toggleLinkDirectionMode
toggleLinkDirectionMode -left> toggleLinkRelationMode

[*] --> modeMoveVariableStock
modeMoveVariableStock -> modeAddLinkFlow
modeAddLinkFlow -left> modeMoveVariableStock

notDeleteItemMode -> deleteItemMode
deleteItemMode -left> notDeleteItemMode

@enduml
```
