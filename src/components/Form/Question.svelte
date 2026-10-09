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

<div class="w-full">
  {#if question.intro}
    <p class="text-2xl">
      {question.intro}
    </p>
  {/if}
  {#if question.type == "text"}
    <label class="text-xl">
      <span class="text-3xl font-bold">{index + 1}.</span>
      {question.label}
      <input
        type="text"
        name={question.name}
        id={question.id}
        bind:value
        required
      />
    </label>
  {:else if question.type == "long-text"}
    <label class="text-xl">
      <span class="text-3xl font-bold">{index + 1}.</span>
      {question.label}
      <TextArea name={question.name} id={question.id} bind:value required
      ></TextArea>
    </label>
  {:else if question.type == "radio"}
    <fieldset class="text-xl">
      <legend>
        <span class="text-3xl font-bold">{index + 1}.</span>
        {question.label}
      </legend>
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
    <fieldset class="text-xl">
      <legend>
        <span class="text-3xl font-bold">{index + 1}.</span>
        {question.label}
      </legend>
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
    <fieldset class="text-xl">
      <legend class="mb-4">
        <span class="text-3xl font-bold">{index + 1}.</span>
        {question.label}
      </legend>
      <div class="flex justify-evenly">
        {#each question.choices as choice}
          <div
            class="grow overflow-clip first:rounded-tl-xl last:rounded-tr-xl first:border-r-0 last:border-l-0 border border-gray-400 hover:bg-gray-600"
          >
            <input
              class="appearance-none peer h-0 w-0 block"
              type="radio"
              bind:group={value}
              name={choice}
              id={choice.toLowerCase()}
              value={choice}
            />
            <label
              class="text-center p-4 select-none peer-checked:bg-gray-700 block cursor-pointer"
              for={choice.toLowerCase()}
            >
              {choice}
            </label>
          </div>
        {/each}
      </div>
      <div class="package-description border w-full p-4 rounded-b-xl">
        {@html value
          ? question.choiceDescriptions[
              question.choices.findIndex((v) => v === value)
            ]
          : "Select a package to see it's description."}
      </div>
    </fieldset>
  {/if}
</div>

<style>
  .package-description :global(ul) {
    list-style-type: "- ";
    list-style-position: outside;
    margin-left: 24px;
  }
</style>
