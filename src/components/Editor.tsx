import React, { useState } from 'react';
import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { CloudUpload, Image as ImageIcon, Heading1, Heading2, Bold, Italic, List, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MenuBar } from './EditorComponents/MenuBar';
import { SlashCommands } from './EditorComponents/SlashCommands';

const Editor = () => {
  const [title, setTitle] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none focus:outline-none text-primary min-h-[300px]',
      },
    },
    onFocus: ({ editor }) => {
      if (editor.isEmpty) {
        editor.commands.setContent('<p></p>');
      }
    },
  });

  const handleInkrypt = () => {
    const walletAddress = localStorage.getItem('walletAddress');
    if (!walletAddress) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet before inscribing.",
        variant: "destructive",
      });
      return;
    }

    // In a real app, you would send the post to a backend here
    // For now, we'll just store it in localStorage
    const posts = JSON.parse(localStorage.getItem('posts') || '[]');
    const newPost = {
      id: Date.now().toString(),
      title,
      content: editor?.getHTML(),
      date: new Date().toISOString().split('T')[0],
    };
    posts.push(newPost);
    localStorage.setItem('posts', JSON.stringify(posts));

    toast({
      title: "Post Published",
      description: "Your article has been successfully published!",
    });
    navigate('/account');
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="text-4xl font-bold border-none outline-none mb-8 placeholder-gray-300 focus:ring-0 bg-transparent text-primary px-0"
        style={{ border: 'none', boxShadow: 'none' }}
      />
      <MenuBar editor={editor} />
      <div className="relative mt-4">
        <EditorContent 
          editor={editor} 
          className="focus:outline-none"
        />
        {editor && editor.isEmpty && (
          <div 
            className="absolute top-0 left-0 text-gray-400 pointer-events-none p-0"
            onClick={() => editor.commands.focus()}
          >
            Start writing...
          </div>
        )}
      </div>
      {editor && (
        <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={editor.isActive('bold') ? 'is-active' : ''}
          >
            Bold
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={editor.isActive('italic') ? 'is-active' : ''}
          >
            Italic
          </Button>
        </BubbleMenu>
      )}
      <div className="fixed bottom-8 left-8">
        <Button onClick={handleBack} variant="outline" className="rounded-full px-6 py-3 shadow-lg transition-all duration-200">
          <ArrowLeft className="mr-2 h-5 w-5" /> Back
        </Button>
      </div>
      <div className="fixed bottom-8 right-8">
        <Button onClick={handleInkrypt} className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-6 py-3 shadow-lg transition-all duration-200">
          <CloudUpload className="mr-2 h-5 w-5" /> Inkrypt
        </Button>
      </div>
    </div>
  );
};

export default Editor;