<script>
  import "carbon-components-svelte/css/white.css";

  import {
    Form,
    FormGroup,
    Checkbox,
    Button,
    Search,
    OrderedList,
    ListItem,
  } from "carbon-components-svelte";

  import { ListStore } from "./list-store.js";
  import createFieldStore from "./store-field";

  let searchField = createFieldStore({
    type: "search",
  });

  let listStore = new ListStore();

  let syncState = listStore.syncState;
  listStore.add([{ a: "test", id: 1 }]);
  listStore.add({ a: "test", id: 2 });
  // $: console.log(listStore);
</script>

<Search
  labelText="Search"
  placeholder="Enter Search"
  bind:value={$searchField.value}
/>
{#if $syncState}
  Syncing
{/if}

<div>{$listStore.length}</div>

<OrderedList>
  {#each $listStore as listItem}
    <ListItem>
      <Checkbox labelText="Label text" />
      <div>{JSON.stringify(listItem)}</div>
    </ListItem>
  {/each}
</OrderedList>

<button
  on:click={() => {
    listStore.add({ a: "fdsfsd" });
  }}>Add</button
>
<button
  on:click={() => {
    listStore.remove(2);
  }}>Remove</button
>
<button
  on:click={() => {
    console.log(listStore.filter({ a: "test" }));
  }}>Filter</button
>
<button
  on:click={() => {
    console.log(listStore.find({ a: "fsdfsd" }));
  }}>Find</button
>
<button on:click={() => listStore.reset()}>reset</button>
