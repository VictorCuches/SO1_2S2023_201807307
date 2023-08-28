// Info de los modulos
#include <linux/module.h>
// Info del kernel en tiempo real
#include <linux/kernel.h>
#include <linux/sched.h>

// Headers para modulos
#include <linux/init.h>
// Header necesario para proc_fs
#include <linux/proc_fs.h>
// Para dar acceso al usuario
#include <asm/uaccess.h>
// Para manejar el directorio /proc
#include <linux/seq_file.h>
// Para get_mm_rss
#include <linux/mm.h>

struct task_struct *cpu; // Estructura que almacena info del cpu

// Almacena los procesos
struct list_head *lstProcess;
// Estructura que almacena info de los procesos hijos
struct task_struct *child;
unsigned long rss;

MODULE_LICENSE("GPL");
MODULE_DESCRIPTION("Modulo de CPU para tarea de Sopes 1");
MODULE_AUTHOR("VictorCuches");

static int escribir_archivo(struct seq_file *archivo, void *v) {
    struct sysinfo info;
    unsigned long total_ram, ram_libre, ram_en_uso, porcentaje_en_uso;

    // Obtener la información del sistema
    si_meminfo(&info);

    total_ram = info.totalram;
    ram_libre = info.freeram;
    ram_en_uso = total_ram - ram_libre;
    porcentaje_en_uso = (ram_en_uso * 100) / total_ram;

    seq_printf(archivo, total_ram * (info.mem_unit / 1024));
    seq_printf(archivo,  ram_en_uso * (info.mem_unit / 1024));
    seq_printf(archivo,  ram_libre * (info.mem_unit / 1024));
    seq_printf(archivo,  porcentaje_en_uso);

    return 0;
}

//Funcion que se ejecutara cada vez que se lea el archivo con el comando CAT
static int al_abrir(struct inode *inode, struct file *file)
{
    return single_open(file, escribir_archivo, NULL);
}

//Si el kernel es 5.6 o mayor se usa la estructura proc_ops
static struct proc_ops operaciones =
{
    .proc_open = al_abrir,
    .proc_read = seq_read
};

//Funcion a ejecuta al insertar el modulo en el kernel con insmod
static int _insert(void)
{
    proc_create("ram_201807307", 0, NULL, &operaciones);
    printk(KERN_INFO "Victor Alejandro Cuches de Leon\n");
    return 0;
}

//Funcion a ejecuta al remover el modulo del kernel con rmmod
static void _remove(void)
{
    remove_proc_entry("ram_201807307", NULL);
    printk(KERN_INFO "Segundo Semestre 2023\n");
}

module_init(_insert);
module_exit(_remove);