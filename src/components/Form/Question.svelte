<script lang="ts">
  import type {
    MultipleChoiceQuestion,
    PackageQuestion,
    Question,
    RadioQuestion,
    TextQuestion,
  } from "./config";
  import TextArea from "./TextArea.svelte";

  let {
    question,
    index,
    value = $bindable(""),
  }: {
    question: Question &
      (PackageQuestion | MultipleChoiceQuestion | RadioQuestion | TextQuestion);
    index: number;
    value: string;
  } = $props();
</script>

<div>
  {#if question.intro}
    <p class="text-2xl">
      {question.intro}
    </p>
  {/if}
  {#if question.type == "text"}
    <label class="text-2xl">
      {index + 1}. {question.label}
      <input
        type="text"
        name={question.name}
        id={question.id}
        bind:value
        required
      />
    </label>
  {:else if question.type == "long-text"}
    <label class="text-2xl">
      {index + 1}. {question.label}
      <TextArea name={question.name} id={question.id} bind:value required
      ></TextArea>
    </label>
  {:else if question.type == "radio"}
    <fieldset class="text-2xl">
      <legend>{index + 1}. {question.label}</legend>
      {#each question.choices as choice}
        <label>
          <input
            type="radio"
            bind:group={value}
            name={choice}
            id={choice.toLowerCase()}
            value={choice}
          />
          {choice}
        </label>
      {/each}
    </fieldset>
  {:else if question.type == "multiple-choice"}
    <fieldset class="text-2xl">
      <legend>{index + 1}. {question.label}</legend>
      {#each question.choices as choice}
        <label>
          <input
            type="checkbox"
            bind:group={value}
            name={choice}
            id={choice.toLowerCase()}
            value={choice}
          />
          {choice}
        </label>
      {/each}
    </fieldset>
  {:else if question.type == "package"}
    <fieldset class="text-2xl">
      <legend>{index + 1}. {question.label}</legend>
      {#each question.choices as choice}
        <label>
          <input
            type="radio"
            bind:group={value}
            name={choice}
            id={choice.toLowerCase()}
            value={choice}
          />
          {choice}
        </label>
      {/each}
    </fieldset>
  {/if}
</div>
